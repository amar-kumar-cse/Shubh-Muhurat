const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const errorHandler = require('./middleware/errorHandler');
const { sanitizeXSS } = require('./middleware/sanitize');
const path = require('path');
const config = require('./config');

const app = express();

// Security headers with Helmet and HSTS
app.use(helmet());
app.use(helmet.hsts({
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true
}));

// Rate limiting setup
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: config.nodeEnv === 'test' ? 1000 : (config.rateLimitMaxRequests || 100),
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false
});

const strictLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: config.nodeEnv === 'test' ? 1000 : 5,
    message: {
        success: false,
        message: 'Too many attempts, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false
});

// Apply rate limiting
app.use('/api', apiLimiter);
app.use('/api/auth/login', strictLimiter);
app.use('/api/contact', (req, res, next) => {
    if (req.method === 'POST') return strictLimiter(req, res, next);
    next();
});

// Restricted CORS
const allowedOrigin = config.nodeEnv === 'production'
    ? (config.allowedOrigins && config.allowedOrigins !== '*' ? config.allowedOrigins : 'https://yourdomain.com')
    : '*';

app.use(cors({
    origin: allowedOrigin,
    credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// NoSQL injection protection (Express 5 compatible)
app.use((req, res, next) => {
    if (req.body && typeof req.body === 'object') {
        mongoSanitize.sanitize(req.body);
    }
    if (req.params && typeof req.params === 'object') {
        mongoSanitize.sanitize(req.params);
    }
    if (req.query && typeof req.query === 'object') {
        mongoSanitize.sanitize(req.query);
    }
    next();
});

// XSS input sanitization
app.use('/api', sanitizeXSS);

// Serve static files securely from public directory only
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Connection
const connectDatabase = async () => {
    if (config.mongoUri) {
        await mongoose.connect(config.mongoUri);
        console.log('✅ Connected to MongoDB');
    }
};

// Import Routes
const bookingRoutes = require('./routes/bookings');
const menuRoutes = require('./routes/menu');
const quoteRoutes = require('./routes/quotes');
const testimonialRoutes = require('./routes/testimonials');
const contactRoutes = require('./routes/contact');
const authRoutes = require('./routes/auth');

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/quotes', quoteRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/contact', contactRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Server is running!',
        timestamp: new Date().toISOString()
    });
});

// Root endpoint
app.get('/api', (req, res) => {
    res.json({
        success: true,
        message: 'Welcome to Shubh Muhurat Caterer API',
        version: '1.0.0',
        endpoints: {
            bookings: '/api/bookings',
            menu: '/api/menu',
            quotes: '/api/quotes',
            testimonials: '/api/testimonials',
            contact: '/api/contact'
        }
    });
});

// 404 handler – JSON for /api/* routes, HTML page for everything else
app.use((req, res) => {
    if (req.path.startsWith('/api/')) {
        return res.status(404).json({
            success: false,
            message: 'API endpoint not found'
        });
    }
    // For page/asset 404s send the custom HTML page
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'), (err) => {
        if (err) {
            // Fallback if 404.html doesn't exist yet
            res.status(404).send('<h1>404 – Page Not Found</h1>');
        }
    });
});

// Error handling middleware (should be last)
app.use(errorHandler);

// Start Server only when executed directly
if (require.main === module) {
    connectDatabase()
        .then(() => {
            app.listen(config.port, () => {
                console.log(`🚀 Server running on http://localhost:${config.port}`);
                console.log(`📊 API Documentation: http://localhost:${config.port}/api`);
            });
        })
        .catch(err => {
            console.error('❌ MongoDB connection error:', err);
            process.exit(1);
        });
}

module.exports = app;
