const services = require('../services');

// Register new user (admin only in production)
exports.register = async (req, res, next) => {
    try {
        const result = await services.auth.registerUser(req.body);

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: result
        });
    } catch (error) {
        next(error);
    }
};

// Login user
exports.login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const result = await services.auth.loginUser(username, password);

        res.json({
            success: true,
            message: 'Login successful',
            data: result
        });
    } catch (error) {
        next(error);
    }
};

// Get current user profile
exports.getMe = async (req, res, next) => {
    try {
        const user = await services.auth.getUserById(req.user.id);

        res.json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    username: user.username,
                    role: user.role,
                    isActive: user.isActive,
                    createdAt: user.createdAt
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

// Update user password
exports.updatePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const token = await services.auth.updatePassword(req.user.id, currentPassword, newPassword);

        res.json({
            success: true,
            message: 'Password updated successfully',
            data: { token }
        });
    } catch (error) {
        next(error);
    }
};
