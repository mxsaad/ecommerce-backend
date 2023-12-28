// /src/db.js
import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();
const db = mysql.createConnection(process.env.DATABASE_URL);

export default db;