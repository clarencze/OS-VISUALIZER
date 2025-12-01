document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');

  // Toggle menu
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  // Close menu on link click
  document.querySelectorAll('.nav-item').forEach(item => {
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
});