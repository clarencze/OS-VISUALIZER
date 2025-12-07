import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

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
const db = getFirestore(app);

// Protect page: redirect if not logged in
onAuthStateChanged(auth, (user) => {
  if (!user ||!user.emailVerified) {
    window.location.href = "../htmls/login.html"; // redirect logged-out users
  }
});


/*
  Page Replacement Algorithm - FIFO, LRU, Optimal
  Using cleaner simulation with FIFO pointer and LRU time tracking
*/
(function () {
  let selectedAlgo = 'fifo';

  const algoButtons = document.querySelectorAll('.algo-btn');
  const numFramesInput = document.getElementById('num-frames');
  const pageSequenceInput = document.getElementById('page-sequence');
  const runBtn = document.getElementById('run-page-algo');
  const logoutBtn = document.getElementById('btn-logout');

  algoButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      algoButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedAlgo = btn.getAttribute('data-algo');
    });
  });

  runBtn.addEventListener('click', () => {
    const frames = parseInt(numFramesInput.value, 10) || 3;
    const sequence = pageSequenceInput.value
      .split(/[\s,]+/)
      .map(p => p.trim())
      .filter(p => p.length > 0)
      .map(p => (isNaN(Number(p)) ? p : Number(p)));

    if (sequence.length === 0) {
      alert('Please enter a valid page sequence');
      return;
    }

    const result = simulatePageReplacement(selectedAlgo, frames, sequence);
    displayPageResults(result);
  });

  function simulatePageReplacement(algo, frames, sequence) {
    let frameArr = Array(frames).fill('-');
    let faults = 0;
    let time = Array(frames).fill(0);
    let counter = 0;
    let fifoIndex = 0;
    const history = [];

    function findLRU() {
      let min = time[0], pos = 0;
      for (let i = 1; i < frames; i++) {
        if (time[i] < min) {
          min = time[i];
          pos = i;
        }
      }
      return pos;
    }

    function findOptimal(i) {
      let farthest = i, pos = -1;
      for (let f = 0; f < frames; f++) {
        if (frameArr[f] === '-') {
          return f; // empty frame
        }
        let nextUse = sequence.slice(i + 1).indexOf(frameArr[f]);
        if (nextUse === -1) {
          return f; // never used again
        }
        if (nextUse > farthest) {
          farthest = nextUse;
          pos = f;
        }
      }
      return pos === -1 ? 0 : pos;
    }

    sequence.forEach((page, i) => {
      let hit = frameArr.includes(page);

      if (!hit) {
        // FAULT
        faults++;

        if (algo === 'fifo') {
          frameArr[fifoIndex] = page;
          fifoIndex = (fifoIndex + 1) % frames;
        } else if (algo === 'lru') {
          let pos = findLRU();
          frameArr[pos] = page;
          counter++;
          time[pos] = counter;
        } else if (algo === 'optimal') {
          let pos = findOptimal(i);
          frameArr[pos] = page;
        }
      } else {
        // HIT
        if (algo === 'lru') {
          let pos = frameArr.indexOf(page);
          counter++;
          time[pos] = counter;
        }
      }

      history.push({
        page,
        memory: frameArr.slice(),
        status: hit ? 'HIT' : 'FAULT',
        faults
      });
    });

    const total = sequence.length;
    const hits = total - faults;
    const hitRatio = total > 0 ? ((hits / total) * 100).toFixed(2) : '0.00';

    return {
      faults,
      hits,
      total,
      hitRatio,
      history
    };
  }

  function displayPageResults(result) {
    const resultsSection = document.getElementById('results-section');

    document.getElementById('page-faults').textContent = result.faults;
    document.getElementById('page-hits').textContent = result.hits;
    document.getElementById('hit-ratio').textContent = result.hitRatio + '%';

    const timeline = document.getElementById('timeline-container');
    timeline.innerHTML = '';
    result.history.forEach((step, idx) => {
      const div = document.createElement('div');
      div.className = 'timeline-step';
      const statusClass = step.status === 'HIT' ? 'hit' : 'fault';

      div.innerHTML = `
        <div class="step-number">${idx + 1}</div>
        <div class="step-page">Page ${step.page}</div>
        <div class="step-memory">
          ${step.memory.filter(p => p !== '-').length > 0
            ? step.memory.map(p => `<span class="memory-slot">${p}</span>`).join('')
            : '<span style="color: var(--text-muted); font-size: 11px;">Empty</span>'}
        </div>
        <div class="step-status ${statusClass}">${step.status}</div>
      `;
      timeline.appendChild(div);
    });

    const tbody = document.getElementById('analysis-tbody');
    tbody.innerHTML = '';
    result.history.forEach((step, idx) => {
      const memoryStr = step.memory
        .filter(p => p !== '-')
        .join(', ') || 'Empty';

      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${idx + 1}</td>
        <td><strong>${step.page}</strong></td>
        <td>${memoryStr}</td>
        <td style="color: ${step.status === 'HIT' ? '#10b981' : '#ef4444'}; font-weight: 600;">${step.status}</td>
        <td><strong>${step.faults}</strong></td>
      `;
      tbody.appendChild(row);
    });

    resultsSection.style.display = 'block';
    resultsSection.scrollIntoView({ behavior: 'smooth' });

    if (window.addHistory) {
      window.addHistory('page-replacement', `${selectedAlgo.toUpperCase()} - Faults: ${result.faults}, Hit Ratio: ${result.hitRatio}%`);
    }
  }

  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('userName');
    window.location.href = 'login.html';
  });
})();

let lastScroll = 0;
const header = document.querySelector(".algo-header");

window.addEventListener("scroll", () => {
  const currentScroll = window.pageYOffset;

  if (currentScroll === 0) {
    header.classList.remove("hidden");
  } else if (currentScroll > lastScroll) {
    header.classList.add("hidden");
  } else {
    header.classList.add("hidden");
  }

  lastScroll = currentScroll;
});