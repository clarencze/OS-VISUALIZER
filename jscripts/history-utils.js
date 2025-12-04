/*
  Shared history utilities across all pages
*/
(function () {
  const keys = {
    'scheduling': 'history_scheduling',
    'page-replacement': 'history_page_replacement'
  };

  function readHistory(alg) {
    const key = keys[alg];
    const raw = localStorage.getItem(key);
    try {
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function writeHistory(alg, arr) {
    const key = keys[alg];
    localStorage.setItem(key, JSON.stringify(arr));
  }

  function addHistory(alg, details) {
    if (!keys[alg]) {
      console.warn('Unknown algorithm key:', alg);
      return;
    }
    const arr = readHistory(alg);
    const entry = {
      ts: new Date().toISOString(),
      details: details || 'run'
    };
    arr.unshift(entry);
    writeHistory(alg, arr.slice(0, 50));
  }

  // Expose globally
  window.addHistory = addHistory;
  window.readHistory = readHistory;
  window.writeHistory = writeHistory;
})();