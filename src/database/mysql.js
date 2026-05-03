import mysql from 'mysql2/promise';
import { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME, NODE_ENV } from '../config/env.js';

if (!DB_HOST || !DB_USER || !DB_NAME) {
    throw new Error('Please define DB_HOST, DB_USER, and DB_NAME in your .env file');
}


export const pool = mysql.createPool({
    host:            DB_HOST     || 'localhost',
    port:            DB_PORT     || 3306,
    user:            DB_USER     || 'root',
    password:        DB_PASSWORD || 'Vijay4043@',
    database:        DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit:      0,
});


const connectToDatabase = async () => {
    try {
        
        const tempPool = mysql.createPool({
            host:     DB_HOST     || 'localhost',
            port:     DB_PORT     || 3306,
            user:     DB_USER     || 'root',
            password: DB_PASSWORD || 'Vijay4043@',
            connectionLimit: 1,
        });

        const conn = await tempPool.getConnection();
        await conn.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
        await conn.query(`USE \`${DB_NAME}\``);
        await conn.query(`
            CREATE TABLE IF NOT EXISTS schools (
                id          INT AUTO_INCREMENT PRIMARY KEY,
                name        VARCHAR(255)   NOT NULL,
                address     VARCHAR(500)   NOT NULL,
                latitude    FLOAT(10, 6)   NOT NULL,
                longitude   FLOAT(10, 6)   NOT NULL,
                created_at  TIMESTAMP      DEFAULT CURRENT_TIMESTAMP
            )
        `);
        conn.release();
        await tempPool.end();

        console.log(`Connected to MySQL database in ${NODE_ENV} mode`);
    } catch (error) {
        console.log('Error connecting to database:', error.message);
        process.exit(1);
    }
};

export default connectToDatabase;