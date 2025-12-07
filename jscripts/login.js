import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-analytics.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

// Firebase config
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

// Elements
const emailInput = document.getElementById("email");
const passField = document.getElementById("password");
const showPass = document.querySelector(".password-toggle");
const remember = document.getElementById("remember");
const loginBtn = document.getElementById("login");
const errorMsg = document.querySelectorAll(".input-error")[1];
const form = document.querySelector(".login-form");

// Password toggle
showPass.addEventListener("click", (e) => {
  e.preventDefault();
  const icon = showPass.querySelector("i");
  if (passField.type === "password") {
    passField.type = "text";
    icon.classList.replace("fa-eye", "fa-eye-slash");
  } else {
    passField.type = "password";
    icon.classList.replace("fa-eye-slash", "fa-eye");
  }
});

// Form submit
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  errorMsg.textContent = "";
  errorMsg.classList.remove("show");

  const email = emailInput.value.trim();
  const password = passField.value.trim();

  if (!email || !password) {
    errorMsg.textContent = "Please fill in both email and password!";
    errorMsg.classList.add("show");
    return;
  }

  loginBtn.disabled = true;
  loginBtn.innerHTML = '<span>Signing in...</span><i class="fas fa-spinner fa-spin"></i>';

  try {
    const persistence = remember.checked ? browserLocalPersistence : browserSessionPersistence;
    await setPersistence(auth, persistence);

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (!user.emailVerified) {
      errorMsg.textContent = "Please verify your email first.";
      errorMsg.classList.add("show");
      await auth.signOut();
      loginBtn.disabled = false;
      loginBtn.innerHTML = '<span>Sign In</span><i class="fas fa-arrow-right"></i>';
      return;
    }

    window.location.href = "/htmls/home.html";
  } catch (err) {
    errorMsg.textContent = "Email or Password is INCORRECT!";
    errorMsg.classList.add("show");
    loginBtn.disabled = false;
    loginBtn.innerHTML = '<span>Sign In</span><i class="fas fa-arrow-right"></i>';
  }
});

// Redirect if already logged in AND email verified
onAuthStateChanged(auth, (user) => {
  if (user && user.emailVerified) {
    window.location.href = "/htmls/home.html";
  }
});
