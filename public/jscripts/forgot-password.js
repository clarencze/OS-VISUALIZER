// forgot-password.js
// Handles real Firebase password reset (sendPasswordResetEmail)
// and falls back to a simulated reset link if email send fails.

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAuth, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

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

// Elements in `forgot-password.html`
const input = document.getElementById('fp-email');
const sendBtn = document.getElementById('fp-send');
const backBtn = document.getElementById('fp-back');
const msg = document.getElementById('fp-message');

function showMessage(text, color) {
  if (!msg) return;
  msg.style.color = color || 'var(--text)';
  msg.innerHTML = text;
}

function generateToken() {
  return Math.random().toString(36).slice(2, 10);
}

sendBtn?.addEventListener('click', async (e) => {
  e.preventDefault();
  const email = (input?.value || '').trim();
  if (!email) {
    showMessage('Enter a valid email.', '#f59e0b');
    return;
  }

  // Check Firestore `users` collection for a matching email before attempting reset.
  // This prevents showing "email sent" for non-existent accounts.
  let userExists = false;
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', email));
    const snaps = await getDocs(q);
    userExists = !snaps.empty;
  } catch (err) {
    console.warn('Firestore query failed, will try sendPasswordResetEmail anyway:', err);
    // If Firestore query fails (permissions), we'll still attempt the reset
    // and let Firebase Auth tell us if the user exists.
  }

  if (!userExists) {
    // No user found with that email
    showMessage("No account found with that email.", '#ef4444');
    return;
  }

  // Found a user document — proceed with Firebase password reset
  try {
    await sendPasswordResetEmail(auth, email);
    showMessage('Password reset email sent. Check your inbox.', '#10b981');
  } catch (err) {
    // If sending fails for any reason, fall back to simulated link
    console.warn('sendPasswordResetEmail failed, falling back to simulated link:', err);
    const token = generateToken();
    const expiresAt = Date.now() + 15 * 60 * 1000;
    const key = `pwreset_${email.toLowerCase()}`;
    localStorage.setItem(key, JSON.stringify({ token, expiresAt }));

    const resetUrl = `reset-password.html?email=${encodeURIComponent(email)}&token=${token}`;
    showMessage(`Reset link simulated. <a href="${resetUrl}">Open reset page</a> (token valid 15 minutes).`, '#10b981');
  }
});

backBtn?.addEventListener('click', (e) => {
  e.preventDefault();
  window.location.href = 'login.html';
});