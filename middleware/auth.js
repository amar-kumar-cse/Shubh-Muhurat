const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const User = require('../models/User');
const config = require('../config');

// Protect routes - verify JWT token
const protect = async (req, res, next) => {
    try {
        let token;

        // Check for token in Authorization header
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        // Check if token exists
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to access this route'
            });
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, config.jwtSecret);

            // Get admin or user from token
            let account = await Admin.findById(decoded.id).select('-password');
            if (!account) {
                account = await User.findById(decoded.id).select('-password');
            }

            if (!account) {
                return res.status(401).json({
                    success: false,
                    message: 'User not found'
                });
            }

            if (!account.isActive) {
                return res.status(401).json({
                    success: false,
                    message: 'User account is inactive'
                });
            }

            req.admin = account;
            req.user = account;

            next();
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: 'Token is invalid or expired'
            });
        }
    } catch (error) {
        next(error);
    }
};

// Grant access to specific roles
const authorize = (...roles) => {
    return (req, res, next) => {
        const currentRole = (req.admin || req.user)?.role;
        if (!currentRole || !roles.includes(currentRole)) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized for this action'
            });
        }
        next();
    };
};

module.exports = { protect, authorize };
