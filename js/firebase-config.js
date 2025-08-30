/* js/firebase-config.js
*/
(function(){
  // Include these scripts in every HTML: (see README) OR load here dynamically
  // Example (if not loaded in HTML): you can include <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js"></script> etc.
  // BUT recommended: include compat scripts in each HTML <head> (see README)
  // Initialize firebase app using the compat API
  const firebaseConfig = {
    apiKey: "YOUR_FIREBASE_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_MSG_SENDER_ID",
    appId: "YOUR_APP_ID"
  };
  // init
  if(!window.firebase || !window.firebase.apps){
    console.error("Firebase SDK not found. Make sure you included firebase-app-compat.js and other compat SDKs in the HTML.");
    return;
  }
  firebase.initializeApp(firebaseConfig);
  // exports via window
  window.auth = firebase.auth();
  window.db = firebase.firestore();
  window.storage = firebase.storage();
})();
