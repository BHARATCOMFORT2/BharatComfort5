// js/dashboard.js - user dashboard
if(!auth) console.error('Auth missing');
auth.onAuthStateChanged(async user=>{
  if(!user) return location.href='auth.html';
  document.getElementById('myBookings').innerHTML = '<p>Loading...</p>';
  const snap = await db.collection('bookings').where('userId','==',user.uid).get();
  document.getElementById('myBookings').innerHTML = snap.docs.map(d=>`<div>${d.data().listingId} • ${d.data().date} • ${d.data().status}</div>`).join('') || '<p>No bookings</p>';
  const rev = await db.collection('reviews').where('userId','==',user.uid).get();
  document.getElementById('myReviews').innerHTML = rev.docs.map(d=>`<div>${d.data().text}</div>`).join('') || '<p>No reviews</p>';
});
function logout(){ auth.signOut().then(()=> location.href='index.html') }

