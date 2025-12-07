import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword, updateProfile, sendEmailVerification, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
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

const fullname = document.getElementById('fullname');
const email = document.getElementById('email');
const password = document.getElementById('password');
const confirm = document.getElementById('confirm-password');
const errorMsg = document.getElementById('error-msg');
const submitBtn = document.getElementById('submit');
const showPassButtons = document.querySelectorAll('.password-toggle');
const termsCheckbox = document.getElementById('terms');

// Show/hide password for all toggle buttons
showPassButtons.forEach(toggle => {
    toggle.addEventListener('click', e => {
        e.preventDefault();
        const input = toggle.closest('.password-wrapper').querySelector('.input-field');
        const icon = toggle.querySelector('i');
        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.replace('fa-eye','fa-eye-slash');
        } else {
            input.type = 'password';
            icon.classList.replace('fa-eye-slash','fa-eye');
        }
    });
});

// Form submit
document.getElementById('registrationForm').addEventListener('submit', async e => {
    e.preventDefault();
    errorMsg.textContent = "";
    submitBtn.disabled = true;

    if (!fullname.value.trim()) { showError("Please fill in your full name!"); return; }
    if (!email.value.trim()) { showError("Please fill in your email!"); return; }
    if (!password.value) { showError("Please fill in your password!"); return; }
    if (password.value !== confirm.value) { showError("Passwords do not match!"); return; }
    if (!termsCheckbox.checked) { showError("You must agree to the terms!"); return; }
    if (password.value.length < 6) { showError("Password must be at least 6 characters!"); return; }

    try {
        const usersRef = collection(db,'users');
        const nameQuery = query(usersRef, where('displayName','==',fullname.value));
        const emailQuery = query(usersRef, where('email','==',email.value));
        const [nameSnap,emailSnap] = await Promise.all([getDocs(nameQuery),getDocs(emailQuery)]);

        if (!nameSnap.empty) { showError("Name already taken!"); return; }
        if (!emailSnap.empty) { showError("Email already registered!"); return; }

        // Create account immediately
        const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
        const user = userCredential.user;

        // Set display name in Firebase Auth
        await updateProfile(user, { displayName: fullname.value });

        // Save user data to Firestore
        await setDoc(doc(db, 'users', user.uid), {
            displayName: fullname.value,
            email: email.value,
            createdAt: new Date()
        });

        // Send verification email
        await sendEmailVerification(user);

        // Store user data temporarily for after verification
        sessionStorage.setItem('pendingRegistration', JSON.stringify({
            uid: user.uid,
            fullname: fullname.value
        }));

        showError('Verification email sent! Check your email and click the link to complete registration.', true);
        
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span><i class="fas fa-spinner fa-spin"></i> Waiting for email verification...</span>';
        
        // Poll Firebase to check if email is verified
        const checkVerification = setInterval(async () => {
            await user.reload(); // Refresh user object from Firebase
            
            if (user.emailVerified) {
                clearInterval(checkVerification);
                // Store user name in localStorage for greeting
                localStorage.setItem('userName', fullname.value);
                // Clear pending registration
                sessionStorage.removeItem('pendingRegistration');
                // Redirect to home
                window.location.href = "../htmls/home.html";
            }
        }, 2000); // Check every 2 seconds

    } catch(err) {
        console.error('Registration error:', err);
        console.error('Error code:', err.code);
        console.error('Error message:', err.message);
        showError(err.message || "Account creation failed!");
        submitBtn.disabled = false;
    }
});

function showError(msg, isSuccess = false){
    errorMsg.textContent = msg;
    if (isSuccess) {
        errorMsg.style.color = '#10b981';
    } else {
        errorMsg.style.color = '';
    }
    submitBtn.disabled = false;
}

//ang lakas ng password mo kua
const passwordInput = document.getElementById('password');
const strengthText = document.querySelector('.strength-text');

passwordInput.addEventListener('input', () => {
    const p = passwordInput.value;
    let score = 0;

    if (p.length >= 6) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;

    passwordInput.classList.remove('strength-weak','strength-medium','strength-strong');

    if (p.length === 0) {
        strengthText.textContent = 'Password Strength';
    }
    else if (score <= 1) {
        passwordInput.classList.add('strength-weak');
        strengthText.textContent = 'Weak';
    } else if (score === 2 || score === 3) {
        passwordInput.classList.add('strength-medium');
        strengthText.textContent = 'Medium';
    } else {
        passwordInput.classList.add('strength-strong');
        strengthText.textContent = 'Strong';
    }
});

const pass = document.getElementById("password");
const bar = document.querySelector(".strength-bar");
const text = document.querySelector(".strength-text");

pass.addEventListener("input", () => {
  let v = pass.value;
  let s = 0;

  if (v.length >= 6) s++;
  if (/[A-Z]/.test(v)) s++;
  if (/[0-9]/.test(v)) s++;
  if (/[^A-Za-z0-9]/.test(v)) s++;

  let width = ["0%", "25%", "50%", "75%", "100%"][s];
  let color = ["", "red", "orange", "yellow", "lime"][s];
  let label = ["Weak", "Weak", "Okay", "Strong", "Very Strong"][s];

  bar.style.setProperty("--bar-width", width);
  bar.style.setProperty("--bar-color", color);
  text.textContent = label;
});

// Terms modal
document.getElementById("openTerms").onclick = function(e) {
  e.preventDefault();
  document.getElementById("termsModal").style.display = "block";
};
document.getElementById("openPrivacy").onclick = function(e) {
  e.preventDefault();
  document.getElementById("privacyModal").style.display = "block";
};
document.getElementById("closeTerms").onclick = function() {
  document.getElementById("termsModal").style.display = "none";
};
document.getElementById("closePrivacy").onclick = function() {
  document.getElementById("privacyModal").style.display = "none";
};

window.onclick = function(event) {
  if (event.target.classList.contains("modal")) {
    event.target.style.display = "none";
  }
};
