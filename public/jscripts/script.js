import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

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

document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navItems = document.querySelectorAll('.nav-item');
  let isScrollingProgrammatically = false;

  // Toggle menu
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  // Close menu on link click
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      navToggle.classList.remove('active');
      navMenu.classList.remove('active');

      // Set active immediately on click
      navItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      // Prevent scroll handler from overriding during smooth scroll
      isScrollingProgrammatically = true;
      setTimeout(() => {
        isScrollingProgrammatically = false;
      }, 600); // match smooth scroll duration
    });
  });

  // Close menu on outside click
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-container')) {
      navToggle.classList.remove('active');
      navMenu.classList.remove('active');
    }
  });

  // Smooth scrolling
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href !== '#') {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          const offsetTop = target.offsetTop - 80;
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // Active nav on scroll
  function updateActiveNav() {
    if (isScrollingProgrammatically) return;

    const sections = document.querySelectorAll('section');
    let currentSectionId = '';

    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
        currentSectionId = section.id;
      }
    });

    navItems.forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('href') === `#${currentSectionId}`) {
        item.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav);

  // Run once on load
  updateActiveNav();

  // ========= AUTH GUARD =========
  let currentUser = null;
  let authReady = false;
  
  onAuthStateChanged(auth, (user) => {
    currentUser = user && user.emailVerified ? user : null;
    authReady = true;
  });

  async function requireAuth(targetPath) {
    // Wait for auth state to be ready
    if (!authReady) {
      await new Promise(resolve => {
        const unsubscribe = onAuthStateChanged(auth, () => {
          unsubscribe();
          resolve();
        });
      });
    }

    if (!currentUser) {
      window.location.href = "../htmls/login.html";
      return false;
    }
    window.location.href = targetPath;
    return true;
  }

  // CTA buttons in hero
  const heroScheduler = document.querySelector('.hero-buttons a[href$="scheduling.html"]');
  if (heroScheduler) {
    heroScheduler.addEventListener('click', (e) => {
      e.preventDefault();
      requireAuth('../htmls/scheduling.html');
    });
  }

  // Footer quick links
  document.querySelectorAll('footer a[href$="scheduling.html"], footer a[href$="page-replacement.html"]').forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const href = a.getAttribute('href');
      requireAuth(href);
    });
  });
});
