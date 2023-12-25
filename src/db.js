// db.js
const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'user',
  database: 'ecommerce',
  connectionLimit: 10,
});

module.exports = pool;