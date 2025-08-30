const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();
// Sign Up
async function signUp(email, password) {
    try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        alert("✅ Account created successfully!");
        return userCredential.user;
    } catch (error) {
        alert("❌ Error: " + error.message);
    }
}

// Login
async function login(email, password) {
    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        alert("✅ Logged in successfully!");
        return userCredential.user;
    } catch (error) {
        alert("❌ Error: " + error.message);
    }
}

// Logout
function logout() {
    auth.signOut().then(() => {
        alert("👋 Logged out!");
        window.location.href = "login.html";
    });
}

// Add Listing (by partners/admins)
async function addListing(data) {
    try {
        await db.collection("listings").add(data);
        alert("✅ Listing added!");
    } catch (error) {
        alert("❌ Error: " + error.message);
    }
}

// Fetch Listings (for customers)
async function loadListings() {
    const listingsContainer = document.getElementById("listings-container");
    if (!listingsContainer) return;

    listingsContainer.innerHTML = "Loading listings...";

    try {
        const snapshot = await db.collection("listings").get();
        listingsContainer.innerHTML = "";

        snapshot.forEach(doc => {
            const listing = doc.data();
            const div = document.createElement("div");
            div.className = "listing-card";
            div.innerHTML = `
                <h3>${listing.name}</h3>
                <p>${listing.city}, ${listing.state}</p>
                <p>Price: ${listing.price} ${listing.currency || "INR"}</p>
                <button onclick="bookListing('${doc.id}')">Book Now</button>
            `;
            listingsContainer.appendChild(div);
        });

    } catch (error) {
        listingsContainer.innerHTML = "❌ Failed to load listings.";
        console.error(error);
    }
}

/*****************************************
 * BOOKINGS
 *****************************************/
async function bookListing(listingId) {
    try {
        const user = auth.currentUser;
        if (!user) {
            alert("⚠️ Please login to book!");
            return;
        }

        await db.collection("bookings").add({
            userId: user.uid,
            listingId: listingId,
            bookedAt: new Date()
        });

        alert("✅ Booking successful!");
    } catch (error) {
        alert("❌ Booking failed: " + error.message);
    }
}

/*****************************************
 * REVIEWS & RATINGS
 *****************************************/
async function addReview(listingId, review, rating) {
    try {
        const user = auth.currentUser;
        if (!user) {
            alert("⚠️ Please login to review!");
            return;
        }

        await db.collection("reviews").add({
            userId: user.uid,
            listingId,
            review,
            rating,
            createdAt: new Date()
        });

        alert("✅ Review submitted!");
    } catch (error) {
        alert("❌ Review failed: " + error.message);
    }
}

/*****************************************
 * EVENT LISTENERS
 *****************************************/
document.addEventListener("DOMContentLoaded", () => {
    // Auto-load listings if on listings.html
    if (window.location.pathname.includes("listings.html")) {
        loadListings();
    }
});
