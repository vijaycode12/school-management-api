// ─── Validate POST /addSchool ──────────────────────────────────────────────────
export const validateAddSchool = (req, res, next) => {
    const { name, address, latitude, longitude } = req.body;

    // Check that all fields are present and not empty
    if (!name || !address || latitude === undefined || longitude === undefined) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required: name, address, latitude, longitude',
        });
    }

    // Check that name and address are non-empty strings
    if (typeof name !== 'string' || name.trim() === '') {
        return res.status(400).json({ success: false, message: 'Name must be a non-empty string' });
    }

    if (typeof address !== 'string' || address.trim() === '') {
        return res.status(400).json({ success: false, message: 'Address must be a non-empty string' });
    }

    // Check that latitude and longitude are valid numbers
    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);

    if (isNaN(lat) || lat < -90 || lat > 90) {
        return res.status(400).json({ success: false, message: 'Latitude must be a number between -90 and 90' });
    }

    if (isNaN(lon) || lon < -180 || lon > 180) {
        return res.status(400).json({ success: false, message: 'Longitude must be a number between -180 and 180' });
    }

    next(); // All good — move to the controller
};

// ─── Validate GET /listSchools ─────────────────────────────────────────────────
export const validateListSchools = (req, res, next) => {
    const { latitude, longitude } = req.query;

    if (latitude === undefined || longitude === undefined) {
        return res.status(400).json({
            success: false,
            message: 'Query parameters required: latitude, longitude',
        });
    }

    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);

    if (isNaN(lat) || lat < -90 || lat > 90) {
        return res.status(400).json({ success: false, message: 'Latitude must be a number between -90 and 90' });
    }

    if (isNaN(lon) || lon < -180 || lon > 180) {
        return res.status(400).json({ success: false, message: 'Longitude must be a number between -180 and 180' });
    }

    next();
};
