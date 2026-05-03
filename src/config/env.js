import { config } from "dotenv";

config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

export const PORT        = process.env.PORT;
export const NODE_ENV    = process.env.NODE_ENV;
export const BACKEND_URL = process.env.BACKEND_URL;


export const DB_HOST     = process.env.MYSQLHOST      || process.env.DB_HOST;
export const DB_USER     = process.env.MYSQLUSER      || process.env.DB_USER;
export const DB_PASSWORD = process.env.MYSQLPASSWORD  || process.env.DB_PASSWORD;
export const DB_NAME     = process.env.MYSQL_DATABASE || process.env.DB_NAME;
export const DB_PORT     = process.env.MYSQLPORT      || process.env.DB_PORT || 3306;