import mysql from 'mysql2/promise';


const DB_HOST     = process.env.MYSQLHOST      || process.env.DB_HOST;
const DB_USER     = process.env.MYSQLUSER      || process.env.DB_USER;
const DB_PASSWORD = process.env.MYSQLPASSWORD  || process.env.DB_PASSWORD;
const DB_NAME     = process.env.MYSQL_DATABASE || process.env.DB_NAME;
const DB_PORT     = process.env.MYSQLPORT      || process.env.DB_PORT || 3306;
const NODE_ENV    = process.env.NODE_ENV;

if (!DB_HOST || !DB_USER || !DB_NAME) {
    throw new Error('Please define DB_HOST, DB_USER, and DB_NAME in your .env file');
}

export const pool = mysql.createPool({
    host:               DB_HOST,
    port:               Number(DB_PORT),
    user:               DB_USER,
    password:           DB_PASSWORD,
    database:           DB_NAME,
    waitForConnections: true,
    connectionLimit:    10,
    queueLimit:         0,
});

const connectToDatabase = async () => {
    try {
        const conn = await pool.getConnection();
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
        console.log(`Connected to MySQL database in ${NODE_ENV} mode`);
    } catch (error) {
        console.log('Error connecting to database:', error.message);
        process.exit(1);
    }
};

export default connectToDatabase;