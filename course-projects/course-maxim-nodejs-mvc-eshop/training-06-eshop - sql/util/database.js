const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'mike',
    database: 'node-eshop',
    password: '48564856'
});

module.exports = pool.promise();