import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  getDocs,
  updateDoc,
  where,
  query
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyC3XkBAjFKRxaMVJBHjfNaxx_es0-1aQm4",
  authDomain: "youthforchrist-347d4.firebaseapp.com",
  projectId: "youthforchrist-347d4",
  storageBucket: "youthforchrist-347d4.appspot.com",
  messagingSenderId: "1062209777347",
  appId: "1:1062209777347:web:fedcb5ca39e8a0b727bc76",
  measurementId: "G-7NTLZ7WTD4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Level calculator
function calcLevel(total) {
  if (total >= 300) return Math.floor(total / 100) + " (Advanced)";
  if (total >= 200) return Math.floor(total / 100) + " (Intermediate)";
  if (total >= 100) return Math.floor(total / 100) + " (Beginner)";
  return "Newbie";
}

// Auth state check
onAuthStateChanged(auth, async (user) => {
  if (!user) return (window.location.href = "login.html");

  const userSnap = await getDoc(doc(db, "users", user.uid));
  if (!userSnap.exists()) return alert("User data not found!");

  const u = userSnap.data();
  const total = u.quizPoints + u.gamePoints;

  document.getElementById("userDetails").innerHTML = `
    <div class="field"><span>Name:</span> ${u.fullName}</div>
    <div class="field"><span>Username:</span> ${u.username}</div>
    <div class="field"><span>Email:</span> ${u.email}</div>
    <div class="field"><span>Membership ID:</span> ${u.membershipID}</div>
    <div class="field"><span>District:</span> ${u.district}</div>
    <div class="field"><span>Church:</span> ${u.church}</div>
    <div class="field"><span>Quiz Points:</span> ${u.quizPoints}</div>
    <div class="field"><span>Game Points:</span> ${u.gamePoints}</div>
    <div class="field"><span>Total Points:</span> ${total}</div>
    <div class="field"><span>Level:</span> ${calcLevel(total)}</div>
  `;

  if (u.isAdmin) loadAdminPanel();
});

// Admin panel logic
async function loadAdminPanel() {
  document.getElementById("adminPanel").classList.remove("hidden");

  const tbody = document.querySelector("#userTable tbody");
  tbody.innerHTML = "";

  const allUsers = await getDocs(collection(db, "users"));
  allUsers.forEach((docSnap) => {
    const d = docSnap.data();
    const total = d.quizPoints + d.gamePoints;
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${d.membershipID}</td>
      <td>${d.username}</td>
      <td><input type="number" value="${d.quizPoints}" /></td>
      <td><input type="number" value="${d.gamePoints}" /></td>
      <td>${total}</td>
      <td><button class="updBtn">Save</button></td>
    `;

    const btn = row.querySelector(".updBtn");
    btn.addEventListener("click", async () => {
      const quiz = parseInt(row.children[2].firstChild.value) || 0;
      const game = parseInt(row.children[3].firstChild.value) || 0;
      await updateDoc(doc(db, "users", docSnap.id), {
        quizPoints: quiz,
        gamePoints: game,
      });
      row.children[4].textContent = quiz + game;
      alert(`Updated ${d.username}`);
    });

    tbody.appendChild(row);
  });

  // CSV upload handling
  document.getElementById("uploadCsv").addEventListener("click", () => {
    const file = document.getElementById("csvFile").files[0];
    if (!file) return alert("Please select a CSV file.");
    const reader = new FileReader();

    reader.onload = async () => {
      const lines = reader.result.trim().split(/\r?\n/);
      for (const line of lines) {
        const [membershipID, quiz, game] = line.split(",");
        const q = query(collection(db, "users"), where("membershipID", "==", membershipID));
        const snap = await getDocs(q);
        if (!snap.empty) {
          const id = snap.docs[0].id;
          await updateDoc(doc(db, "users", id), {
            quizPoints: parseInt(quiz) || 0,
            gamePoints: parseInt(game) || 0,
          });
        }
      }
      alert("CSV upload complete!");
      loadAdminPanel(); // Refresh table
    };

    reader.readAsText(file);
  });
}
