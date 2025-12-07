import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBEFCfRwjnkfOBvnIEch0lDbAIB9cyVCNY",
  authDomain: "ostangek.firebaseapp.com",
  projectId: "ostangek",
  storageBucket: "ostangek.firebasestorage.app",
  messagingSenderId: "609103081490",
  appId: "1:609103081490:web:49159005342d820b47e8cb",
  measurementId: "G-8WN4PR8E3D"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', () => {
    const greetingEl = document.getElementById('greeting');

    onAuthStateChanged(auth, async (user) => {
        if (!user ||!user.emailVerified) {
            window.location.href = "/htmls/login.html"; // redirect if logged out
            return;
        }

        try {
            const userRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                const data = userSnap.data();
                greetingEl.textContent = `Welcome, ${data.displayName || "User"}!`;
            } else {
                greetingEl.textContent = `Welcome, ${user.displayName || "User"}!`;
            }
        } catch (err) {
            console.error("Failed to fetch displayName:", err);
            greetingEl.textContent = "Welcome back, User";
        }
    });

    function renderHistory(alg) {
        const ul = document.getElementById(`history-${alg}`);
        if (!ul) return;
        ul.innerHTML = '';
        const arr = window.readHistory(alg);
        if (!arr.length) {
            const li = document.createElement('li');
            li.textContent = 'No runs yet.';
            ul.appendChild(li);
            return;
        }
        arr.forEach(item => {
            const li = document.createElement('li');
            const d = new Date(item.ts);
            li.innerHTML = `<div><strong>${item.details}</strong></div>
                            <div class="history-meta">${d.toLocaleString()}</div>`;
            ul.appendChild(li);
        });
    }

    function clearHistory(alg) {
        window.writeHistory(alg, []);
        renderHistory(alg);
        updateStats();
    }

    function updateStats() {
        const schedHist = window.readHistory('scheduling');
        const pageHist = window.readHistory('page-replacement');
        const total = schedHist.length + pageHist.length;

        document.getElementById('stat-total').textContent = total;
        document.getElementById('stat-scheduling').textContent = schedHist.length;
        document.getElementById('stat-replacement').textContent = pageHist.length;
    }

    document.getElementById('open-scheduling').addEventListener('click', () => {
        window.location.href = 'scheduling.html';
    });

    document.getElementById('open-pagerepl').addEventListener('click', () => {
        window.location.href = 'page-replacement.html';
    });

    renderHistory('scheduling');
    renderHistory('page-replacement');
    updateStats();

    document.querySelectorAll('.btn-clear').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const alg = e.currentTarget.getAttribute('data-alg');
            if (confirm('Clear all history for ' + alg + '?')) {
                clearHistory(alg);
            }
        });
    });

    const logoutBtn = document.getElementById('btn-logout');
    logoutBtn.addEventListener('click', async () => {
        await signOut(auth);
        window.location.href = "/htmls/index.html";
    });
});
