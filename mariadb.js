const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'Bookshop',
    password: 'root',
    dateStrings: true
});

module.exports = connection;