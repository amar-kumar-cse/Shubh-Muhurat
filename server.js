const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const errorHandler = require('./middleware/errorHandler');
const path = require('path');
const config = require('./config');

const app = express();

// Security middleware
app.use(helmet({
    contentSecurityPolicy: false, // Disable CSP for simplicity with static files
    crossOriginEmbedderPolicy: false
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: config.rateLimitWindowMs,
    max: config.rateLimitMaxRequests,
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false
});

// Apply rate limiting to API routes only
app.use('/api', limiter);

// Middleware
app.use(cors({
    origin: config.allowedOrigins,
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// NoSQL injection protection
app.use((req, res, next) => {
    if (req.body) {
        mongoSanitize.sanitize(req.body);
    }

    if (req.params) {
        mongoSanitize.sanitize(req.params);
    }

    next();
});

// Serve static files from public directory only
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Connection
const connectDatabase = async () => {
    await mongoose.connect(config.mongoUri);
    console.log('✅ Connected to MongoDB');
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

// 404 handler for undefined routes
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'API endpoint not found'
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
