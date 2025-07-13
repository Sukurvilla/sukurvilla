import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";

// Firebase configuration – same as in scripts.js
const firebaseConfig = {
  apiKey: "AIzaSyAVUD4isvd7YzjKr2vXbfKMxwyGuq_CGYI",
  authDomain: "sukurvilla-b54cc.firebaseapp.com",
  projectId: "sukurvilla-b54cc",
  storageBucket: "sukurvilla-b54cc.appspot.com", // <-- FIXED to match
  messagingSenderId: "1094373850696",
  appId: "1:1094373850696:web:a5e1d4282272adaac9627d",
  measurementId: "G-TC4FH8PC5T"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const reservationListDiv = document.getElementById("reservation-list");

// Function to fetch reservations from the single document
async function fetchReservations() {
  try {
    const reservationsDocRef = doc(db, "reservations", "reservations");
    const docSnap = await getDoc(reservationsDocRef);
    reservationListDiv.innerHTML = "";
    if (docSnap.exists()) {
      const data = docSnap.data();
      const reservationsArray = data.reservations || [];
      // Loop through the reservations array and display each reservation
      reservationsArray.forEach((res) => {
        const resDiv = document.createElement("div");
        resDiv.classList.add("reservation-item");
        resDiv.innerHTML = `
          <p><strong>Ad:</strong> ${res.name} | <strong>Email:</strong> ${res.email}</p>
          <p><strong>Giriş:</strong> ${res.checkIn} | <strong>Çıkış:</strong> ${res.checkOut}</p>
          <p><strong>Konuk Sayısı:</strong> ${res.guests} | <strong>Durum:</strong> ${res.status}</p>
          <p><strong>Mesaj:</strong> ${res.message}</p>
          <button onclick="updateStatus('${res.id}', 'accepted')">Kabul Et</button>
          <button onclick="updateStatus('${res.id}', 'denied')">Reddet</button>
          <hr>
        `;
        reservationListDiv.appendChild(resDiv);
      });
    } else {
      reservationListDiv.innerHTML = "<p>No reservations found.</p>";
    }
  } catch (error) {
    console.error("Error fetching reservations:", error);
  }
}

// Expose updateStatus globally so that button onclick events work.
window.updateStatus = async function(reservationId, newStatus) {
  try {
    const reservationsDocRef = doc(db, "reservations", "reservations");
    // Fetch the current reservations array
    const docSnap = await getDoc(reservationsDocRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      let reservationsArray = data.reservations || [];
      // Update the status of the reservation with matching id
      reservationsArray = reservationsArray.map((res) => {
        if (res.id === reservationId) {
          return { ...res, status: newStatus };
        }
        return res;
      });
      // Write the updated array back to Firestore
      await updateDoc(reservationsDocRef, { reservations: reservationsArray });
      alert("Rezervasyon güncellendi: " + newStatus);
      fetchReservations();
    }
  } catch (error) {
    console.error("Error updating reservation:", error);
  }
};

fetchReservations();