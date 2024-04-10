// Get the client
const mysql = require('mysql2');

// Create the connection to database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'Bookshop',
    password: 'root',
    dateStrings: true
    // string 값으로 fix 되어있는게 아니라 기준 값을 저장해놓고 time_zone에 따라 바뀐 값을 보여줌
    // 이거 안쓰면 raw 값을 볼 수 있음
});

module.exports = connection;