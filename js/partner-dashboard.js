// partner-dashboard.js
auth.onAuthStateChanged(async user=>{
  if(!user) return location.href='auth.html';
  loadPartnerListings(user.uid);
});

async function loadPartnerListings(uid){
  const snap = await db.collection('listings').where('createdBy','==',auth.currentUser.uid).get();
  document.getElementById('partnerListings').innerHTML = snap.docs.map(d=>`<div class="card-box"><strong>${d.data().name}</strong> - ${d.data().status} <button onclick="deleteListing('${d.id}')">Delete</button></div>`).join('') || '<p>No listings</p>';
}

document.getElementById('addListingForm').addEventListener('submit', async (e)=>{
  e.preventDefault();
  const name = document.getElementById('p_name').value;
  const city = document.getElementById('p_city').value;
  const type = document.getElementById('p_type').value;
  const desc = document.getElementById('p_desc').value;
  const mapsLink = document.getElementById('p_maps').value;
  const imageFile = document.getElementById('p_image').files[0];
  const videoFile = document.getElementById('p_video').files[0];
  const price = parseInt(document.getElementById('p_price').value||0,10);

  // upload media
  let imageUrl = '';
  if(imageFile){
    const refImg = storage.ref(`listings/images/${Date.now()}_${imageFile.name}`);
    await refImg.put(imageFile);
    imageUrl = await refImg.getDownloadURL();
  }
  let videoUrl = '';
  if(videoFile){
    const refVid = storage.ref(`listings/videos/${Date.now()}_${videoFile.name}`);
    await refVid.put(videoFile);
    videoUrl = await refVid.getDownloadURL();
  }
  // save listing
  await db.collection('listings').add({
    name, city, type, description: desc, mapsLink, mapsEmbed: mapsLink ? mapsLink.replace('/maps/place','/maps/embed') : '',
    imageUrl, videoUrl, priceINR: price, createdBy: auth.currentUser.uid, status: 'pending', createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });
  alert('Listing submitted for approval');
  loadPartnerListings();
});

window.deleteListing = async (id) => {
  await db.collection('listings').doc(id).delete();
  loadPartnerListings();
};

