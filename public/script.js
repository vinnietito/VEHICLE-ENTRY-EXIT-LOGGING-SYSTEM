const baseURL = 'http://localhost:3000';

async function logEntry() {
    const plate = document.getElementById('plate').value.toUpperCase();
    if (!plate) return alert('Enter plate number');
    await fetch(`${baseURL}/entry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plate })
    });
    refreshTables();
}

async function logExit() {
  const plate = document.getElementById('plate').value.toUpperCase();
  if (!plate) return alert('Enter plate number');
  await fetch(`${baseURL}/exit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ plate })
  });
  refreshTables();
}

async function refreshTables() {
  const current = await (await fetch(`${baseURL}/current`)).json();
  const logs = await (await fetch(`${baseURL}/logs`)).json();

  document.getElementById('currentTable').innerHTML = `
    <tr><th>Plate</th><th>Entry Time</th></tr>
    ${current.map(row => `<tr><td>${row.plate_number}</td><td>${row.entry_time}</td></tr>`).join('')}
  `;

  document.getElementById('logTable').innerHTML = `
    <tr><th>Plate</th><th>Entry</th><th>Exit</th><th>Status</th></tr>
    ${logs.map(row => `<tr>
      <td>${row.plate_number}</td>
      <td>${row.entry_time}</td>
      <td>${row.exit_time || '-'}</td>
      <td>${row.status}</td>
    </tr>`).join('')}
  `;
}

refreshTables();