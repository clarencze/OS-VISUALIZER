document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.login-form');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const passwordToggle = document.querySelector('.password-toggle');
  const loginBtn = document.querySelector('.login-btn');
  const socialBtns = document.querySelectorAll('.social-btn');

  // Password visibility toggle
  if (passwordToggle) {
    passwordToggle.addEventListener('click', (e) => {
      e.preventDefault();
      const icon = passwordToggle.querySelector('i');

      if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
      } else {
        passwordInput.type = 'password';
        icon.classList.add('fa-eye');
        icon.classList.remove('fa-eye-slash');
      }
    });
  }

  // Form submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    // Clear previous errors
    document.querySelectorAll('.input-error').forEach(error => {
      error.classList.remove('show');
    });

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value)) {
      showError(emailInput, 'Please enter a valid email address');
      isValid = false;
    }

    // Validate password
    if (passwordInput.value.length < 6) {
      showError(passwordInput, 'Password must be at least 6 characters');
      isValid = false;
    }

    if (isValid) {
      handleLogin();
    }
  });

  function handleLogin() {
    loginBtn.disabled = true;
    loginBtn.innerHTML = '<span>Signing in...</span><i class="fas fa-spinner fa-spin"></i>';

    // Simulate API call
    setTimeout(() => {
      loginBtn.disabled = false;
      loginBtn.innerHTML = '<span>Sign In</span><i class="fas fa-arrow-right"></i>';
      alert('Login successful! (Demo)');
      form.reset();
    }, 2000);
  }

  function showError(input, message) {
    const errorElement = input.parentElement.querySelector('.input-error');
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.classList.add('show');
    }
  }

  // Social login handlers
  socialBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const provider = btn.classList[1]; // google-btn, github-btn, etc.
      alert(`Login with ${provider.replace('-btn', '').toUpperCase()} (Demo)`);
    });
  });

  // Forgot password link
  const forgotLink = document.querySelector('.forgot-password');
  if (forgotLink) {
    forgotLink.addEventListener('click', (e) => {
      e.preventDefault();
      alert('Password reset link sent to your email! (Demo)');
    });
  }
});