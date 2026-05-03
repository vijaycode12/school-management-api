import express from 'express';
import cors from 'cors';

import { PORT } from './src/config/env.js';

import schoolRouter from './src/routes/school.routes.js';
import connectToDatabase from './src/database/mysql.js';
import errorMiddleware from './src/middleware/error.middleware.js';
// import { addSchool, listSchools } from './controllers/school.controller.js';
// import { validateAddSchool, validateListSchools } from './middleware/validate.middleware.js';

const app = express();

console.log('ENV CHECK:', {
    MYSQLHOST: process.env.MYSQLHOST,
    MYSQL_DATABASE: process.env.MYSQL_DATABASE,
    DB_HOST: process.env.DB_HOST,
});

const allowedOrigins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:3000',
];

app.use(cors({
    origin: function (origin, callback) {
        console.log('CORS Origin:', origin);
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use('/api/v1/schools', schoolRouter);

app.use(errorMiddleware);

app.get('/', (req, res) => {
    res.send('Welcome to school management')
});

app.listen(PORT, async()=>{
    console.log(`School Management API running on port ${PORT}`);
    await connectToDatabase();
});