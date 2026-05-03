import { pool } from '../database/mysql.js';


const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const R      = 6371;
    const toRad  = (deg) => (deg * Math.PI) / 180;

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};


export const addSchool = async (req, res, next) => {
    try {
        const { name, address, latitude, longitude } = req.body;

        const [result] = await pool.query(
            'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)',
            [name.trim(), address.trim(), parseFloat(latitude), parseFloat(longitude)]
        );

        const [rows] = await pool.query(
            'SELECT * FROM schools WHERE id = ?',
            [result.insertId]
        );

        res.status(201).json({
            success: true,
            message: 'School added successfully',
            data: rows[0],
        });
    } catch (error) {
        next(error);
    }
};


export const listSchools = async (req, res, next) => {
    try {
        const userLat = parseFloat(req.query.latitude);
        const userLon = parseFloat(req.query.longitude);

        const [schools] = await pool.query('SELECT * FROM schools');

        if (schools.length === 0) {
            return res.status(200).json({
                success: true,
                message: 'No schools found',
                data: [],
            });
        }

        const sorted = schools
            .map((school) => ({
                ...school,
                distance_km: parseFloat(
                    haversineDistance(userLat, userLon, school.latitude, school.longitude).toFixed(2)
                ),
            }))
            .sort((a, b) => a.distance_km - b.distance_km);

        res.status(200).json({
            success: true,
            message: 'Schools fetched and sorted by proximity',
            user_location: { latitude: userLat, longitude: userLon },
            total: sorted.length,
            data: sorted,
        });
    } catch (error) {
        next(error);
    }
};