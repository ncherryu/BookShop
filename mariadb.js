// Get the client
// const mysql = require('mysql2/promise');
const mysql = require('mysql2');

// Create the connection to database
// const connection = async () => {
//     const conn = await mysql.createConnection({
//         host: 'localhost',
//         user: 'root',
//         database: 'Bookshop',
//         password: 'root',
//         dateStrings: true
//     });

//     return conn;
// }
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'Bookshop',
    password: 'root',
    dateStrings: true
});

module.exports = connection;