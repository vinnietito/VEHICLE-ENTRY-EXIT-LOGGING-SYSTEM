const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',       // <-- your MySQL username
  password: 'V@38080135k',       // <-- your MySQL password
  database: 'vehicle_logs'
});

connection.connect(err => {
  if (err) {
    console.error('Database connection error:', err);
    process.exit(1);
  }
  console.log('Connected to MySQL database');
});

module.exports = connection;
