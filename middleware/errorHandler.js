const logger = require('../utils/logger');

// Global error handling middleware
const errorHandler = (err, req, res, next) => {
    const isProduction = process.env.NODE_ENV === 'production';

    // Log full error details to Winston logger
    logger.error(`${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`, {
        stack: err.stack,
        body: req.body,
        query: req.query
    });

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            success: false,
            message: 'Validation Error',
            errors: Object.values(err.errors).map(e => e.message)
        });
    }

    // Mongoose CastError (invalid ID)
    if (err.name === 'CastError') {
        return res.status(400).json({
            success: false,
            message: 'Invalid ID format'
        });
    }

    // MongoDB duplicate key error
    if (err.code === 11000) {
        return res.status(400).json({
            success: false,
            message: 'Duplicate field value entered'
        });
    }

    // Default error
    const statusCode = err.statusCode || 500;
    const message = isProduction && statusCode >= 500
        ? 'Something went wrong'
        : err.message || 'Internal Server Error';

    res.status(statusCode).json({
        success: false,
        message
    });
};

module.exports = errorHandler;
