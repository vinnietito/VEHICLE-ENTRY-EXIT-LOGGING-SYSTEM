const express = require('express');
const cors = require('cors');
const connection = require('./db');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Log vehicle entry
app.post('/entry', (req, res) => {
  const { plate } = req.body;
  if (!plate) return res.status(400).json({ error: 'Plate number required' });

  const sql = 'INSERT INTO vehicles (plate_number, entry_time, status) VALUES (?, NOW(), "Inside")';
  connection.query(sql, [plate], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Entry logged successfully' });
  });
});

// Log vehicle exit
app.post('/exit', (req, res) => {
  const { plate } = req.body;
  if (!plate) return res.status(400).json({ error: 'Plate number required' });

  const sql = `
    UPDATE vehicles
    SET exit_time = NOW(), status = 'Left'
    WHERE plate_number = ? AND status = 'Inside'
    ORDER BY entry_time DESC
    LIMIT 1
  `;

  connection.query(sql, [plate], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.affectedRows === 0) return res.status(404).json({ message: 'No active entry found for this plate' });
    res.json({ message: 'Exit logged successfully' });
  });
});

// Get current vehicles inside
app.get('/current', (req, res) => {
  const sql = 'SELECT plate_number, entry_time FROM vehicles WHERE status = "Inside" ORDER BY entry_time DESC';
  connection.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Get all logs
app.get('/logs', (req, res) => {
  const sql = 'SELECT plate_number, entry_time, exit_time, status FROM vehicles ORDER BY entry_time DESC';
  connection.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
