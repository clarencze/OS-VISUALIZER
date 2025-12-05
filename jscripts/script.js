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
});
