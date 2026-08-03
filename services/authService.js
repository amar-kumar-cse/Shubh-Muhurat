const User = require('../models/User');
const jwt = require('jsonwebtoken');
const config = require('../config');
const { pick } = require('../utils');

const registerFields = ['username', 'password', 'role'];

exports.generateToken = (id) => {
    return jwt.sign({ id }, config.jwtSecret, {
        expiresIn: config.jwtExpiresIn
    });
};

exports.registerUser = async (userData) => {
    const sanitizedUserData = pick(userData, registerFields);
    const existingUser = await User.findOne({ username: sanitizedUserData.username });
    if (existingUser) {
        throw new Error('Username already exists');
    }
    
    const user = await User.create(sanitizedUserData);
    const token = exports.generateToken(user._id);
    
    return {
        user: {
            id: user._id,
            username: user.username,
            role: user.role
        },
        token
    };
};

exports.loginUser = async (username, password) => {
    const user = await User.findOne({ username }).select('+password');
    
    if (!user) {
        throw new Error('Invalid credentials');
    }
    
    if (!user.isActive) {
        throw new Error('Account is inactive');
    }
    
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        throw new Error('Invalid credentials');
    }
    
    const token = exports.generateToken(user._id);
    
    return {
        user: {
            id: user._id,
            username: user.username,
            role: user.role
        },
        token
    };
};

exports.getUserById = async (id) => {
    return await User.findById(id);
};

exports.updatePassword = async (userId, currentPassword, newPassword) => {
    const user = await User.findById(userId).select('+password');
    
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
        throw new Error('Current password is incorrect');
    }
    
    user.password = newPassword;
    await user.save();
    
    return exports.generateToken(user._id);
};
