document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.register-form');
  const fullnameInput = document.getElementById('fullname');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirm-password');
  const passwordToggles = document.querySelectorAll('.password-toggle');
  const registerBtn = document.querySelector('.register-btn');

  // Password visibility toggle
  passwordToggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      const wrapper = toggle.closest('.password-wrapper');
      const input = wrapper.querySelector('.input-field');
      const icon = toggle.querySelector('i');

      if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
      } else {
        input.type = 'password';
        icon.classList.add('fa-eye');
        icon.classList.remove('fa-eye-slash');
      }
    });
  });

  // Password strength indicator
  passwordInput.addEventListener('input', (e) => {
    const password = e.target.value;
    let strength = 'weak';

    if (password.length >= 8) {
      if (/[A-Z]/.test(password) && /[0-9]/.test(password) && /[!@#$%^&*]/.test(password)) {
        strength = 'strong';
      } else if (/[A-Z]/.test(password) || /[0-9]/.test(password)) {
        strength = 'medium';
      }
    }

    passwordInput.classList.remove('strength-weak', 'strength-medium', 'strength-strong');
    passwordInput.classList.add(`strength-${strength}`);
  });

  // Form validation
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    // Clear previous errors
    document.querySelectorAll('.input-error').forEach(error => {
      error.classList.remove('show');
    });

    // Validate full name
    if (fullnameInput.value.trim().length < 3) {
      showError(fullnameInput, 'Full name must be at least 3 characters');
      isValid = false;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value)) {
      showError(emailInput, 'Please enter a valid email address');
      isValid = false;
    }

    // Validate password
    if (passwordInput.value.length < 8) {
      showError(passwordInput, 'Password must be at least 8 characters');
      isValid = false;
    }

    // Validate password match
    if (passwordInput.value !== confirmPasswordInput.value) {
      showError(confirmPasswordInput, 'Passwords do not match');
      isValid = false;
    }

    if (isValid) {
      // Simulate form submission
      registerBtn.disabled = true;
      registerBtn.innerHTML = '<span>Creating account...</span><i class="fas fa-spinner fa-spin"></i>';

      setTimeout(() => {
        registerBtn.disabled = false;
        registerBtn.innerHTML = '<span>Create Account</span><i class="fas fa-arrow-right"></i>';
        alert('Account created successfully! (Demo)');
        form.reset();
      }, 2000);
    }
  });

  function showError(input, message) {
    const errorElement = input.parentElement.querySelector('.input-error');
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.classList.add('show');
    }
  }
});