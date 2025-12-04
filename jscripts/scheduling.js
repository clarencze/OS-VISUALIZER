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
  if (!user) {
    window.location.href = "/htmls/login.html"; // redirect logged-out users
  }
});



/*
  Scheduling Algorithm Page - FCFS & SJF (non-preemptive)
  Preserves insertion order to avoid alphabetical tie-breaking.
*/
(function () {
  let selectedAlgo = 'fcfs';
  let processes = [];
  let insertCounter = 0;

  const algoButtons = document.querySelectorAll('.algo-btn');
  const processNameInput = document.getElementById('process-name');
  const arrivalTimeInput = document.getElementById('arrival-time');
  const burstTimeInput = document.getElementById('burst-time');
  const addProcessBtn = document.getElementById('add-process');
  const runAlgoBtn = document.getElementById('run-algorithm');
  const clearProcessesBtn = document.getElementById('clear-processes');
  const processTableBody = document.getElementById('process-tbody');
  const logoutBtn = document.getElementById('btn-logout');

  algoButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      algoButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedAlgo = btn.getAttribute('data-algo');
    });
  });

  addProcessBtn.addEventListener('click', () => {
    const name = processNameInput.value.trim();
    const arrival = parseInt(arrivalTimeInput.value, 10);
    const burst = parseInt(burstTimeInput.value, 10);

    if (!name || isNaN(burst) || burst <= 0 || isNaN(arrival) || arrival < 0) {
      alert('Please fill valid Process Name, Arrival (>=0) and Burst (>0)');
      return;
    }

    processes.push({
      name,
      arrival,
      burst,
      id: Math.random().toString(36).substr(2, 9),
      order: insertCounter++
    });
    renderProcessTable();
    processNameInput.value = '';
    arrivalTimeInput.value = '0';
    burstTimeInput.value = '';
    runAlgoBtn.disabled = false;
  });

  function renderProcessTable() {
    processTableBody.innerHTML = '';
    if (processes.length === 0) {
      processTableBody.innerHTML = '<tr class="empty-row"><td colspan="4" style="text-align: center; color: #9aa3ad;">No processes added yet</td></tr>';
      return;
    }

    processes.forEach((p, idx) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td><strong>${p.name}</strong></td>
        <td>${p.arrival}</td>
        <td>${p.burst}</td>
        <td><button class="remove-btn" data-idx="${idx}">Remove</button></td>
      `;
      processTableBody.appendChild(row);
    });

    const removeBtns = processTableBody.querySelectorAll('.remove-btn');
    removeBtns.forEach(b => {
      b.addEventListener('click', (e) => {
        const idx = parseInt(e.currentTarget.getAttribute('data-idx'), 10);
        processes.splice(idx, 1);
        renderProcessTable();
        if (processes.length === 0) runAlgoBtn.disabled = true;
      });
    });
  }

  runAlgoBtn.addEventListener('click', () => {
    if (processes.length === 0) return;
    const result = scheduleProcesses(selectedAlgo, processes);
    displayResults(result);
  });

  function scheduleProcesses(algo, procs) {
    if (!Array.isArray(procs) || procs.length === 0) return [];

    const list = procs.map(p => ({ ...p }));
    const schedule = [];
    let time = 0;

    if (algo === 'fcfs') {
      const queue = list.slice().sort((a, b) => {
        if (a.arrival !== b.arrival) return a.arrival - b.arrival;
        return a.order - b.order;
      });
      queue.forEach(p => {
        const start = Math.max(time, p.arrival);
        const end = start + p.burst;
        schedule.push({
          name: p.name,
          arrival: p.arrival,
          burst: p.burst,
          start,
          end,
          waiting: start - p.arrival,
          turnaround: end - p.arrival
        });
        time = end;
      });
    } else if (algo === 'sjf') {
      const pending = list.slice().sort((a, b) => {
        if (a.arrival !== b.arrival) return a.arrival - b.arrival;
        return a.order - b.order;
      });

      while (pending.length > 0) {
        const available = pending.filter(p => p.arrival <= time);
        let next;
        if (available.length === 0) {
          time = pending[0].arrival;
          continue;
        } else {
          available.sort((a, b) => {
            if (a.burst !== b.burst) return a.burst - b.burst;
            if (a.arrival !== b.arrival) return a.arrival - b.arrival;
            return a.order - b.order;
          });
          next = available[0];
        }
        const start = Math.max(time, next.arrival);
        const end = start + next.burst;
        schedule.push({
          name: next.name,
          arrival: next.arrival,
          burst: next.burst,
          start,
          end,
          waiting: start - next.arrival,
          turnaround: end - next.arrival
        });
        time = end;
        const idx = pending.findIndex(p => p.id === next.id);
        if (idx > -1) pending.splice(idx, 1);
      }
    } else {
      return scheduleProcesses('fcfs', procs);
    }

    return schedule;
  }

  function displayResults(schedule) {
    if (!Array.isArray(schedule) || schedule.length === 0) return;

    const resultsSection = document.getElementById('results-section');
    const avgWait = (schedule.reduce((sum, p) => sum + p.waiting, 0) / schedule.length).toFixed(2);
    const avgTurnaround = (schedule.reduce((sum, p) => sum + p.turnaround, 0) / schedule.length).toFixed(2);
    const totalTime = Math.max(...schedule.map(p => p.end));

    document.getElementById('avg-wait').textContent = avgWait + ' ms';
    document.getElementById('avg-turnaround').textContent = avgTurnaround + ' ms';
    document.getElementById('total-time').textContent = totalTime + ' ms';

    const ganttChart = document.getElementById('gantt-chart');
    ganttChart.innerHTML = '';
    const minStart = Math.min(...schedule.map(p => p.start));
    const maxEnd = Math.max(...schedule.map(p => p.end));
    const totalDuration = Math.max(1, maxEnd - minStart);
    const scale = Math.max(8, Math.min(30, 600 / totalDuration));

    schedule.forEach(p => {
      const block = document.createElement('div');
      block.className = 'gantt-block';
      block.textContent = `${p.name} (${p.start}-${p.end})`;
      block.style.width = ((p.end - p.start) * scale) + 'px';
      block.style.minWidth = '24px';
      ganttChart.appendChild(block);
    });

    const tbody = document.getElementById('scheduling-tbody');
    tbody.innerHTML = '';
    schedule.forEach(p => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td><strong>${p.name}</strong></td>
        <td>${p.arrival}</td>
        <td>${p.burst}</td>
        <td>${p.end}</td>
        <td>${p.turnaround.toFixed(2)}</td>
        <td>${p.waiting.toFixed(2)}</td>
      `;
      tbody.appendChild(row);
    });

    resultsSection.style.display = 'block';
    resultsSection.scrollIntoView({ behavior: 'smooth' });

    if (window.addHistory) {
      window.addHistory('scheduling', `${selectedAlgo.toUpperCase()} - Avg Wait: ${avgWait}ms, Avg Turnaround: ${avgTurnaround}ms`);
    }
  }

  clearProcessesBtn.addEventListener('click', () => {
    if (confirm('Clear all processes?')) {
      processes = [];
      renderProcessTable();
      runAlgoBtn.disabled = true;
      document.getElementById('results-section').style.display = 'none';
    }
  });

  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('userName');
    window.location.href = 'login.html';
  });

  renderProcessTable();
})();