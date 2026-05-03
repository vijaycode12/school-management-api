const errorMiddleware = (err, req, res, next) => {
    try {
        let error = { ...err };
        error.message = err.message;
        console.log(err);

        if (err.code === 'ER_DUP_ENTRY') {
            const message = "Duplicate entry found";
            error = new Error(message);
            error.statusCode = 400;
        }

        if (err.name === 'ValidationError') {
            const message = Object.values(err.errors).map(val => val.message);
            error = new Error(message.join(", "));
            error.statusCode = 400;
        }

        res.status(error.statusCode || 500).json({
            success: false,
            error: error.message || "Server error"
        });
    } catch (error) {
        next(error);
    }
};

export default errorMiddleware;