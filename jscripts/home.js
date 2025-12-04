/*
  Homepage JS - Enhanced with stats
*/
(function () {
  function renderHistory(alg) {
    const ul = document.getElementById(`history-${alg}`);
    if (!ul) return;
    ul.innerHTML = '';
    const arr = window.readHistory(alg);
    if (!arr.length) {
      const li = document.createElement('li');
      li.textContent = 'No runs yet.';
      ul.appendChild(li);
      return;
    }
    arr.forEach(item => {
      const li = document.createElement('li');
      const d = new Date(item.ts);
      li.innerHTML = `<div><strong>${item.details}</strong></div>
                      <div class="history-meta">${d.toLocaleString()}</div>`;
      ul.appendChild(li);
    });
  }

  function clearHistory(alg) {
    window.writeHistory(alg, []);
    renderHistory(alg);
    updateStats();
  }

  function updateStats() {
    const schedHist = window.readHistory('scheduling');
    const pageHist = window.readHistory('page-replacement');
    const total = schedHist.length + pageHist.length;

    document.getElementById('stat-total').textContent = total;
    document.getElementById('stat-scheduling').textContent = schedHist.length;
    document.getElementById('stat-replacement').textContent = pageHist.length;
  }

  document.addEventListener('DOMContentLoaded', () => {
    const name = localStorage.getItem('userName') || localStorage.getItem('username') || 'User';
    document.getElementById('greeting').textContent = `Welcome back, ${name}`;

    // Navigate to scheduling page
    document.getElementById('open-scheduling').addEventListener('click', () => {
      window.location.href = 'scheduling.html';
    });

    // Navigate to page replacement page
    document.getElementById('open-pagerepl').addEventListener('click', () => {
      window.location.href = 'page-replacement.html';
    });

    renderHistory('scheduling');
    renderHistory('page-replacement');
    updateStats();

    document.querySelectorAll('.btn-clear').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const alg = e.currentTarget.getAttribute('data-alg');
        if (confirm('Clear all history for ' + alg + '?')) {
          clearHistory(alg);
        }
      });
    });
  });
})();