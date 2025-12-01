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
