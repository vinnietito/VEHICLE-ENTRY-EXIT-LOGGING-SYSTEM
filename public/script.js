const baseURL = 'http://localhost:3000';

async function logEntry() {
  const plateInput = document.getElementById('plate');
  const plate = plateInput.value.trim().toUpperCase();
  if (!plate) {
    alert('Please enter a plate number');
    return;
  }

  try {
    const res = await fetch(`${baseURL}/entry`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plate }),
    });

    if (!res.ok) {
      const data = await res.json();
      alert(data.error || data.message || 'Failed to log entry');
      return;
    }

    plateInput.value = '';
    await refreshTables();
  } catch (err) {
    alert('Network error: ' + err.message);
  }
}

async function logExit() {
  const plateInput = document.getElementById('plate');
  const plate = plateInput.value.trim().toUpperCase();
  if (!plate) {
    alert('Please enter a plate number');
    return;
  }

  try {
    const res = await fetch(`${baseURL}/exit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plate }),
    });

    if (!res.ok) {
      const data = await res.json();
      alert(data.error || data.message || 'Failed to log exit');
      return;
    }

    plateInput.value = '';
    await refreshTables();
  } catch (err) {
    alert('Network error: ' + err.message);
  }
}

async function fetchCurrent() {
  const res = await fetch(`${baseURL}/current`);
  if (!res.ok) throw new Error('Failed to fetch current vehicles');
  return res.json();
}

async function fetchLogs() {
  const res = await fetch(`${baseURL}/logs`);
  if (!res.ok) throw new Error('Failed to fetch logs');
  return res.json();
}

function formatDateTime(dt) {
  if (!dt) return '-';
  const d = new Date(dt);
  return d.toLocaleString();
}

async function refreshTables() {
  try {
    const current = await fetchCurrent();
    const logs = await fetchLogs();

    const currentBody = document.querySelector('#currentTable tbody');
    currentBody.innerHTML = '';
    current.forEach(v => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${v.plate_number}</td><td>${formatDateTime(v.entry_time)}</td>`;
      currentBody.appendChild(tr);
    });

    const logsBody = document.querySelector('#logTable tbody');
    logsBody.innerHTML = '';
    logs.forEach(v => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${v.plate_number}</td>
        <td>${formatDateTime(v.entry_time)}</td>
        <td>${formatDateTime(v.exit_time)}</td>
        <td>${v.status}</td>
      `;
      logsBody.appendChild(tr);
    });
  } catch (err) {
    console.error('Failed to refresh tables:', err);
  }
}

window.onload = () => {
  refreshTables();
};
