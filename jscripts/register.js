import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { getFirestore, collection, query, where, getDocs, doc, setDoc } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

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
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.register-form');
  const fullnameInput = document.getElementById('fullname');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirm-password');
  const registerBtn = document.querySelector('.register-btn');

  // Toggle Password Visibility
  document.querySelectorAll('.password-toggle').forEach(toggle => {
    toggle.addEventListener('click', e => {
      e.preventDefault();
      const input = toggle.closest('.password-wrapper').querySelector('.input-field');
      const icon = toggle.querySelector('i');
      if (input.type === 'password') {
        input.type = 'text';
        icon.classList.replace('fa-eye', 'fa-eye-slash');
      } else {
        input.type = 'password';
        icon.classList.replace('fa-eye-slash', 'fa-eye');
      }
    });
  });

  // Password Strength Indicator
  passwordInput.addEventListener('input', e => {
    const password = e.target.value;
    let strength = 'weak';
    if (password.length >= 8) {
      if (/[A-Z]/.test(password) && /[0-9]/.test(password) && /[!@#$%^&*]/.test(password)) strength = 'strong';
      else if (/[A-Z]/.test(password) || /[0-9]/.test(password)) strength = 'medium';
    }
    passwordInput.classList.remove('strength-weak','strength-medium','strength-strong');
    passwordInput.classList.add(`strength-${strength}`);
  });

  // Form Submit
  form.addEventListener('submit', async e => {
    e.preventDefault();
    let isValid = true;

    document.querySelectorAll('.input-error').forEach(err => err.classList.remove('show'));

    if (fullnameInput.value.trim().length < 3) { showError(fullnameInput,'Full name must be at least 3 characters'); isValid=false; }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value)) { showError(emailInput,'Please enter a valid email'); isValid=false; }
    if (passwordInput.value.length < 8) { showError(passwordInput,'Password must be at least 8 characters'); isValid=false; }
    if (passwordInput.value !== confirmPasswordInput.value) { showError(confirmPasswordInput,'Passwords do not match'); isValid=false; }

    if (!isValid) return;

    registerBtn.disabled = true;
    registerBtn.innerHTML = '<span>Creating account...</span><i class="fas fa-spinner fa-spin"></i>';

    try {
      const usersRef = collection(db,'users');
      const usernameQuery = query(usersRef, where('displayName','==',fullnameInput.value));
      const emailQuery = query(usersRef, where('email','==',emailInput.value));
      const [usernameSnap,emailSnap] = await Promise.all([getDocs(usernameQuery),getDocs(emailQuery)]);

      if (!usernameSnap.empty) { showError(fullnameInput,'Name already taken'); resetBtn(); return; }
      if (!emailSnap.empty) { showError(emailInput,'Email already registered'); resetBtn(); return; }

      const userCredential = await createUserWithEmailAndPassword(auth,emailInput.value,passwordInput.value);
      const user = userCredential.user;

      await setDoc(doc(db,'users',user.uid), {
        uid: user.uid,
        displayName: fullnameInput.value,
        email: user.email
      });

      window.location.href = "success.html";

    } catch(err) {
      console.error(err);
      alert(err.message);
      resetBtn();
    }
  });

  function showError(input,message) {
    const error = input.parentElement.querySelector('.input-error');
    if (error) { error.textContent=message; error.classList.add('show'); }
  }

  function resetBtn() {
    registerBtn.disabled=false;
    registerBtn.innerHTML='<span>Create Account</span><i class="fas fa-arrow-right"></i>';
  }
});
