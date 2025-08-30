auth.onAuthStateChanged(async user=>{
  if(!user) return location.href='auth.html';
  loadPending();
});

async function loadPending(){
  const snap = await db.collection('listings').where('status','==','pending').get();
  const container = document.getElementById('pendingListings') || document.body;
  container.innerHTML = snap.docs.map(d=>{
    const data = d.data();
    return `<div class="card-box"><h4>${data.name}</h4><p>${data.city}</p><p>${data.description}</p><button onclick="approve('${d.id}')">Approve</button> <button onclick="reject('${d.id}')">Reject</button></div>`;
  }).join('') || '<p>No pending listings</p>';
}

window.approve = async (id) => { await db.collection('listings').doc(id).update({status:'approved'}); loadPending(); };
window.reject = async (id) => { await db.collection('listings').doc(id).update({status:'rejected'}); loadPending(); };

