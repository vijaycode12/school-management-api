const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'school_management',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

/**
 * Initialize DB: create database and schools table if they don't exist.
 */
async function initializeDatabase() {
  // Temporary connection without specifying a database to create it if needed
  const tempPool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    waitForConnections: true,
    connectionLimit: 1,
  });

  const conn = await tempPool.getConnection();
  try {
    await conn.query(
      `CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'school_management'}\``
    );
    await conn.query(`USE \`${process.env.DB_NAME || 'school_management'}\``);
    await conn.query(`
      CREATE TABLE IF NOT EXISTS schools (
        id          INT AUTO_INCREMENT PRIMARY KEY,
        name        VARCHAR(255)  NOT NULL,
        address     VARCHAR(500)  NOT NULL,
        latitude    FLOAT(10, 6)  NOT NULL,
        longitude   FLOAT(10, 6)  NOT NULL,
        created_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Database and schools table ready');
  } finally {
    conn.release();
    await tempPool.end();
  }
}

module.exports = { pool, initializeDatabase };
