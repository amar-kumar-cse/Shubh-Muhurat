require('dotenv').config();

const config = {
    port: process.env.PORT || 3000,
    mongoUri: process.env.MONGODB_URI,
    jwtSecret: process.env.JWT_SECRET || 'fallback-secret-key-change-in-production',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
    nodeEnv: process.env.NODE_ENV || 'development',
    allowedOrigins: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
    rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100
};

// Validate required config
if (!config.mongoUri) {
    throw new Error('MONGODB_URI is required in environment variables');
}

if (config.nodeEnv === 'production' && config.jwtSecret === 'fallback-secret-key-change-in-production') {
    throw new Error('JWT_SECRET must be set in production environment');
}

module.exports = config;
