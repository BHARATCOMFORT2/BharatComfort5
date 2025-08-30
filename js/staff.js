auth.onAuthStateChanged(async user=>{
  if(!user) return location.href='auth.html';
  const snap = await db.collection('tasks').where('assignedTo','==', user.uid).get();
  document.getElementById('taskContainer').innerHTML = snap.docs.map(d=>`<div>${d.data().title} • ${d.data().status} <button onclick="complete('${d.id}')">Complete</button></div>`).join('') || '<p>No tasks</p>';
});
window.complete = async (id) => { await db.collection('tasks').doc(id).update({status:'completed'}); alert('Task updated'); };

