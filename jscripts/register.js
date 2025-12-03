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

        const userCredential = await createUserWithEmailAndPassword(auth,email.value,password.value);
        const user = userCredential.user;

        await setDoc(doc(db,'users',user.uid), {
            uid: user.uid,
            displayName: fullname.value,
            email: user.email
        });

        window.location.href = "success.html";

    } catch(err) {
        console.error(err);
        showError("Account creation failed!");
    }
});

function showError(msg){
    errorMsg.textContent = msg;
    submitBtn.disabled = false;
}

// Terms modal
document.getElementById('openTerms').onclick = e => {
    e.preventDefault();
    document.getElementById('termsModal').style.display = 'block';
};

document.getElementById('closeTerms').onclick = () => {
    document.getElementById('termsModal').style.display = 'none';
};

window.onclick = e => {
    if (e.target === document.getElementById('termsModal')) {
        document.getElementById('termsModal').style.display = 'none';
    }
};
