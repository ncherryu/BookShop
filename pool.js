const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'Bookshop',
    password: 'root',
    dateStrings: true
});

module.exports = pool;