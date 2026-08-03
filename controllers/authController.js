const services = require('../services');

// Register new user/admin
exports.register = async (req, res, next) => {
    try {
        const result = await services.auth.registerUser(req.body);

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: result,
            token: result.token
        });
    } catch (error) {
        next(error);
    }
};

// Login user/admin
exports.login = async (req, res, next) => {
    try {
        const identifier = req.body.email || req.body.username;
        if (!identifier || !req.body.password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email/username and password'
            });
        }

        const result = await services.auth.loginUser(identifier, req.body.password);

        res.json({
            success: true,
            message: 'Login successful',
            token: result.token,
            data: result
        });
    } catch (error) {
        if (error.message === 'Invalid credentials') {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        if (error.message.includes('locked')) {
            return res.status(423).json({ success: false, message: error.message });
        }
        next(error);
    }
};

// Get current admin/user profile
exports.getMe = async (req, res, next) => {
    try {
        const account = await services.auth.getUserById((req.admin || req.user).id);

        res.json({
            success: true,
            data: {
                user: {
                    id: account._id,
                    email: account.email,
                    username: account.username,
                    role: account.role,
                    isActive: account.isActive,
                    createdAt: account.createdAt
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

// Update password
exports.updatePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = (req.admin || req.user).id;
        const token = await services.auth.updatePassword(userId, currentPassword, newPassword);

        res.json({
            success: true,
            message: 'Password updated successfully',
            data: { token },
            token
        });
    } catch (error) {
        next(error);
    }
};
