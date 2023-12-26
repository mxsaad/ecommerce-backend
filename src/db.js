import mysql from 'mysql2';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'user',
  database: 'ecommerce',
  connectionLimit: 10,
});

export default pool;