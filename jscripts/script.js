document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navItems = document.querySelectorAll('.nav-item');

  // Toggle menu
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  // Close menu on link click
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });

  // Close menu on outside click
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-container')) {
      navToggle.classList.remove('active');
      navMenu.classList.remove('active');
    }
  });

  // Set active nav item
  const currentLocation = location.pathname;
  navItems.forEach(item => {
    if (item.getAttribute('href') === currentLocation || 
        (currentLocation === '/' && item.getAttribute('href') === '#')) {
      item.classList.add('active');
    }
  });
});

document.querySelector(".explore-btn").addEventListener("click", () => {
    alert("Opening Operating System guide...");
});

// ========== HERO VIDEO OPTIMIZATION ========== 
document.addEventListener('DOMContentLoaded', function() {
  const heroVideo = document.querySelector('.hero-video');
  
  if (heroVideo) {
    function handleVideoDisplay() {
      // Hide video on mobile, show on larger screens
      if (window.innerWidth <= 768) {
        heroVideo.style.display = 'none';
        heroVideo.pause();
      } else {
        heroVideo.style.display = 'block';
        heroVideo.play().catch(() => {
          // If autoplay fails, fallback is already in place
        });
      }
    }

    // Initial check
    handleVideoDisplay();

    // Listen for window resize
    window.addEventListener('resize', handleVideoDisplay);

    // Handle video errors
    heroVideo.addEventListener('error', function() {
      this.style.display = 'none';
    });

    // Prefers reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      heroVideo.pause();
    }
  }

  // ========== RESPONSIVE MENU HANDLING ==========
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navItems = document.querySelectorAll('.nav-item');

  if (navToggle) {
    navToggle.addEventListener('click', function() {
      navMenu.classList.toggle('active');
      this.classList.toggle('active');
    });

    navItems.forEach(item => {
      item.addEventListener('click', function() {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
      });
    });

    document.addEventListener('click', function(event) {
      if (!event.target.closest('.nav-container')) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
      }
    });
  }

  // ========== SMOOTH SCROLLING ==========
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

  // ========== INTERSECTION OBSERVER FOR ANIMATIONS ==========
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.feature-card, .team-card, .timeline-item, .card').forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(element);
  });

  // ========== HANDLE WINDOW RESIZE ==========
  let resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      if (window.innerWidth > 768 && navMenu) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
      }
    }, 250);
  });

  // ========== NAV ACTIVE STATE ==========
  function updateActiveNav() {
    const sections = document.querySelectorAll('section');
    navItems.forEach(item => item.classList.remove('active'));

    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= 100 && rect.bottom >= 100) {
        const targetLink = document.querySelector(`a[href="#${section.id}"]`);
        if (targetLink) {
          targetLink.classList.add('active');
        }
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav);
});
