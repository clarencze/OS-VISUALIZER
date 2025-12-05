// forgot-password.js — create a simulated reset token and show a reset link
(function () {
  const input = document.getElementById('fp-email');
  const sendBtn = document.getElementById('fp-send');
  const backBtn = document.getElementById('fp-back');
  const msg = document.getElementById('fp-message');

  function generateToken() {
    return Math.random().toString(36).slice(2, 10);
  }

  sendBtn.addEventListener('click', () => {
    const email = (input.value || '').trim().toLowerCase();
    if (!email) {
      msg.style.color = '#f59e0b';
      msg.textContent = 'Enter a valid email.';
      return;
    }

    const token = generateToken();
    const expiresAt = Date.now() + 15 * 60 * 1000;
    const key = `pwreset_${email}`;
    localStorage.setItem(key, JSON.stringify({ token, expiresAt }));

    // build a relative reset link (same folder)
    const resetUrl = `reset-password.html?email=${encodeURIComponent(email)}&token=${token}`;

    msg.style.color = '#10b981';
    msg.innerHTML = `Reset link simulated. <a href="${resetUrl}">Open reset page</a> (token valid 15 minutes).`;
  });

  backBtn.addEventListener('click', () => {
    window.location.href = 'login.html';
  });
})();