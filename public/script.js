const baseURL = 'http://localhost:3000';

async function logEntry() {
  const plate = document.getElementById('plate').value.trim().toUpperCase();
  if (!plate) return alert('Please enter a plate number.');

  try {
    const res = await fetch(`${baseURL}/entry`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plate })
    });

    if (res.ok) {
      alert('Entry logged successfully!');
      document.getElementById('plate').value = '';
      refreshTables();
    } else {
      const data = await res.json();
      alert(data.message || 'Failed to log entry.');
    }
  } catch (error) {
    alert('Error logging entry. Please check your server.');
    console.error(error);
  }
}

async function logExit() {
  const plate = document.getElementById('plate').value.trim().toUpperCase();
  if (!plate) return alert('Please enter a plate number.');

  try {
    const res = await fetch(`${baseURL}/exit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plate })
    });

    if (res.ok) {
      alert('Exit logged successfully!');
      document.getElementById('plate').value = '';
      refreshTables();
    } else {
      const data = await res.json();
      alert(data.message || 'Failed to log exit.');
    }
  } catch (error) {
    alert('Error logging exit. Please check your server.');
    console.error(error);
  }
}

async function refreshTables() {
  try {
    const [current, logs] = await Promise.all([
      fetch(`${baseURL}/current`).then(res => res.json()),
      fetch(`${baseURL}/logs`).then(res => res.json())
    ]);

    const currentTableBody = document.querySelector('#currentTable tbody');
    const logTableBody = document.querySelector('#logTable tbody');

    currentTableBody.innerHTML = current.length
      ? current.map(row => `
          <tr>
            <td>${row.plate_number}</td>
            <td>${formatDateTime(row.entry_time)}</td>
          </tr>
        `).join('')
      : '<tr><td colspan="2">No vehicles currently inside.</td></tr>';

    logTableBody.innerHTML = logs.length
      ? logs.map(row => `
          <tr>
            <td>${row.plate_number}</td>
            <td>${formatDateTime(row.entry_time)}</td>
            <td>${row.exit_time ? formatDateTime(row.exit_time) : '-'}</td>
          </tr>
        `).join('')
      : '<tr><td colspan="3">No logs available.</td></tr>';
  } catch (error) {
    console.error('Error fetching tables:', error);
  }
}

function formatDateTime(datetime) {
  const d = new Date(datetime);
  return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
}

refreshTables();
