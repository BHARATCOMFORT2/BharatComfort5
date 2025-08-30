// js/chatbot.js - simple widget (lightweight)
(function(){
  // create minimal chat UI (if not present)
  if(!document.getElementById('chatWidget')){
    const w = document.createElement('div'); w.id='chatWidget';
    w.style.position='fixed'; w.style.bottom='18px'; w.style.right='18px'; w.style.zIndex=9999;
    w.innerHTML = `<button id="openChat" class="btn">Chat</button><div id="chatBox" style="display:none;background:#fff;border-radius:12px;padding:8px;box-shadow:0 8px 32px rgba(2,6,23,0.2);width:320px;height:380px;overflow:auto"></div>`;
    document.body.appendChild(w);
    document.getElementById('openChat').addEventListener('click', ()=>{
      const box = document.getElementById('chatBox');
      box.style.display = box.style.display==='none' ? 'block' : 'none';
      box.innerHTML = `<div style="font-weight:700">BharatComfort Assistant</div><div style="margin-top:8px">Ask about bookings, listings, reviews.</div><input id="chatInput" placeholder="Type message" style="width:100%;margin-top:8px"/><button id="sendChat" class="btn" style="margin-top:6px">Send</button>`;
      document.getElementById('sendChat').onclick = async ()=>{
        const msg = document.getElementById('chatInput').value.trim();
        if(!msg) return;
        // very basic responses
        if(msg.toLowerCase().includes('booking')) box.innerHTML += `<div class="muted">To book, go to a listing and click Book Now.</div>`;
        else if(msg.toLowerCase().includes('reviews')) box.innerHTML += `<div class="muted">You can add reviews on listing pages.</div>`;
        else box.innerHTML += `<div class="muted">We will get back to you. (AI upgrade pending)</div>`;
      };
    });
  }
})();

