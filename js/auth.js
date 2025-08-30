// js/auth.js
if(!window.auth) console.error("Firebase Auth not initialized");
document.getElementById('loginBtn').addEventListener('click', async ()=>{
  const email = document.getElementById('loginEmail').value;
  const pwd = document.getElementById('loginPassword').value;
  try{
    const cred = await auth.signInWithEmailAndPassword(email, pwd);
    const snap = await db.collection('users').doc(cred.user.uid).get();
    const role = snap.exists ? snap.data().role : 'user';
    // redirect by role
    switch(role){
      case 'partner': location.href='partner-dashboard.html'; break;
      case 'admin': location.href='admin-dashboard.html'; break;
      case 'superadmin': location.href='superadmin-dashboard.html'; break;
      case 'staff': location.href='staff-dashboard.html'; break;
      default: location.href='user-dashboard.html';
    }
  }catch(e){ alert(e.message); }
});

document.getElementById('registerBtn').addEventListener('click', async ()=>{
  const name = document.getElementById('regName').value;
  const email = document.getElementById('regEmail').value;
  const pwd = document.getElementById('regPassword').value;
  const role = document.getElementById('regRole').value;
  try{
    const cred = await auth.createUserWithEmailAndPassword(email, pwd);
    await db.collection('users').doc(cred.user.uid).set({
      name, email, role, createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    alert('Registered. Redirecting...');
    if(role==='partner') location.href='partner-dashboard.html'; else location.href='user-dashboard.html';
  }catch(e){ alert(e.message); }
});

