const rateLimit = require('express-rate-limit');

module.exports = (message) => rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 3,
    message: {
        success: false,
        message
    },
    standardHeaders: true,
    legacyHeaders: false
});