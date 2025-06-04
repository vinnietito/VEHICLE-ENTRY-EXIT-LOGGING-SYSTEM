const express = require('express');
const app = express();
const cors = require('cors');
const connection = require('./db');

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Log vehicle entry
app.post('/entry', (req, res) => {
    const { plate } = req.body;
    const sql = 'INSERT INTO vehicles (plate_number, entry_time) VALUES (?, NOW())'
    connection.query(sql, [plate], err => {
        if (err) return res.status(500).json({ error: err.meesage });
        res.json({ message: 'Entry logged successfully'});
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
        if (results.affectedRows === 0) return res.status(404).json({ message: 'Vehicle not found or already exited' });
        res.json({ message: 'Exit logged successfully' });
    });
});

// Get current vehicles
app.get('/current', (req, res) => {
  const sql = 'SELECT * FROM vehicles WHERE status = "Inside" ORDER BY entry_time DESC';
  connection.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});