const mysql = require('mysql2');

const connection = mysql.CreateConnection({
    host: 'localhost',
    user: 'root',
    password: 'V@38080135k',
    database: 'vehicle_logs'
});

connection.connect(err => {
    if (err) throw err;
    console.log("Connected to Mysql");
});

module.exports = connection;