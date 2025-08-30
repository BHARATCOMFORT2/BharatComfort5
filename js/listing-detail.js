/* js/listing-detail.js - show a single listing, reviews, booking + payment (Razorpay) */
(async function(){
  if(!window.db) return console.error("Firestore not initialized");
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  const container = document.getElementById('listingContainer');
  if(!id) { container.innerHTML = '<p>No listing id provided.</p>'; return; }

  const docRef = await db.collection('listings').doc(id).get();
  if(!docRef.exists){ container.innerHTML = '<p>Listing not found.</p>'; return; }
  const data = docRef.data();
  // render
  container.innerHTML = `
    <div class="card">
      <div class="media"><img src="${data.imageUrl || 'assets/images/placeholder.png'}" alt=""></div>
      <div class="body">
        <h2>${data.name}</h2>
        <div class="muted">${data.city} • ${data.type || ''}</div>
        <p>${data.description || ''}</p>
        <div style="display:flex;gap:8px;margin-top:8px">
          <div class="price">${formatCurrency(convert(data.priceINR||0,'INR'),'INR')}</div>
          <div class="muted">${(data.rating||0).toFixed(1)} ★</div>
        </div>

        <div style="margin-top:12px">
          <label>Select date</label><input id="bookingDate" type="date" />
          <label>Guests</label><input id="bookingGuests" type="number" min="1" value="1" />
          <button class="btn" id="bookBtn" style="margin-left:8px">Book Now</button>
        </div>

        <div style="margin-top:12px" id="mapsWrap">
          ${data.mapsLink ? `<iframe src="${data.mapsEmbed || data.mapsLink.replace('/maps/place','/maps/embed')}" width="100%" height="300" style="border:0;" loading="lazy"></iframe>` : ''}
          <div style="margin-top:8px"><a class="button" href="${data.mapsLink || '#'}" target="_blank">Get Directions</a></div>
        </div>

        <div style="margin-top:12px">
          ${data.videoUrl ? `<video controls width="100%"><source src="${data.videoUrl}" type="video/mp4"></video>` : ''}
        </div>

        <div style="margin-top:18px" id="reviewsSection">
          <h3>Reviews</h3>
          <div id="reviewsList"></div>
          <div style="margin-top:8px">
            <textarea id="reviewText" placeholder="Share your experience"></textarea><br>
            <input type="file" id="reviewVideo" accept="video/*"><br>
            <button id="submitReviewBtn" class="button primary">Submit Review</button>
          </div>
        </div>
      </div>
    </div>
  `;

  // load reviews
  async function loadReviews(){
    const revSnap = await db.collection('reviews').where('listingId','==',id).orderBy('createdAt','desc').get();
    const out = revSnap.docs.map(d => {
      const r = d.data();
      return `<div style="padding:8px;border-bottom:1px solid #eef"><strong>${r.userName||r.userId}</strong> <small class="muted">${new Date(r.createdAt?.toDate?.()||r.createdAt||Date.now()).toLocaleString()}</small><p>${r.text}</p>${r.videoUrl?`<video controls width="250"><source src="${r.videoUrl}"></video>`:''}</div>`;
    }).join('');
    document.getElementById('reviewsList').innerHTML = out || '<p class="muted">No reviews yet.</p>';
  }
  loadReviews();

  // submit review
  document.getElementById('submitReviewBtn').addEventListener('click', async ()=>{
    const text = document.getElementById('reviewText').value;
    const file = document.getElementById('reviewVideo').files[0];
    const user = auth.currentUser;
    if(!user){ alert('Please login to review.'); return; }
    let videoUrl = '';
    if(file){
      const ref = storage.ref(`reviews/${Date.now()}_${file.name}`);
      await ref.put(file);
      videoUrl = await ref.getDownloadURL();
    }
    await db.collection('reviews').add({
      listingId: id,
      userId: user.uid,
      userName: user.displayName || user.email,
      text,
      videoUrl,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    alert('Review submitted!');
    document.getElementById('reviewText').value='';
    loadReviews();
  });

  // booking + payment flow using Razorpay (demo)
  document.getElementById('bookBtn').addEventListener('click', async ()=>{
    const user = auth.currentUser;
    if(!user){ alert('Please login to book.'); return; }
    const date = document.getElementById('bookingDate').value;
    const guests = parseInt(document.getElementById('bookingGuests').value||1,10);
    if(!date){ alert('Select a date'); return; }
    // create booking doc (pending)
    const bookingRef = await db.collection('bookings').add({
      listingId: id,
      userId: user.uid,
      date,
      guests,
      amount: data.priceINR || 0,
      currency: 'INR',
      status: 'pending',
      paymentStatus: 'unpaid',
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    // call Razorpay checkout
    const amountPaise = (data.priceINR || 0) * 100;
    const options = {
      key: "YOUR_RAZORPAY_KEY",
      amount: amountPaise,
      currency: "INR",
      name: data.name,
      description: "Booking payment",
      handler: async function(resp){
        // update booking
        await db.collection('bookings').doc(bookingRef.id).update({
          paymentStatus: 'paid',
          paymentId: resp.razorpay_payment_id,
          status: 'confirmed'
        });
        alert('Payment success — booking confirmed!');
      },
      prefill:{email: user.email}
    };
    const rzp = new Razorpay(options);
    rzp.open();
  });

})();

