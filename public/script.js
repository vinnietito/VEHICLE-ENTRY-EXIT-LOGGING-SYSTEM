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