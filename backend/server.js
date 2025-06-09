const express = require('express');
const cors = require('cors');
const path = require('path');
const connection = require('./db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, '..', 'public')));

// Log vehicle entry
app.post('/entry', (req, res) => {
  const { plate } = req.body;
  const sql = 'INSERT INTO vehicles (plate_number, entry_time, status) VALUES (?, NOW(), "Inside")';
  connection.query(sql, [plate], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Entry logged successfully' });
  });
});

// Log vehicle exit
app.post('/exit', (req, res) => {
  const { plate } = req.body;
  const sql = `UPDATE vehicles SET exit_time = NOW(), status = 'Left'
               WHERE plate_number = ? AND status = 'Inside'
               ORDER BY entry_time DESC LIMIT 1`;
  connection.query(sql, [plate], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Vehicle not found or already exited' });
    }
    res.json({ message: 'Exit logged successfully' });
  });
});

// Get all currently parked vehicles
app.get('/current', (req, res) => {
  const sql = 'SELECT * FROM vehicles WHERE status = "Inside" ORDER BY entry_time DESC';
  connection.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Get all vehicle logs
app.get('/logs', (req, res) => {
  const sql = 'SELECT * FROM vehicles ORDER BY entry_time DESC';
  connection.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Serve frontend for root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log('Connected to MySQL database');
  console.log(`Server running at http://localhost:${PORT}`);
});
