const Admin = require('../models/Admin');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const config = require('../config');
const { pick } = require('../utils');

const registerFields = ['email', 'username', 'password', 'role'];

exports.generateToken = (account) => {
    return jwt.sign(
        { id: account._id, role: account.role },
        config.jwtSecret,
        { expiresIn: config.jwtExpiresIn }
    );
};

exports.registerUser = async (userData) => {
    const sanitizedData = pick(userData, registerFields);
    const email = sanitizedData.email ? sanitizedData.email.toLowerCase() : undefined;
    const username = sanitizedData.username ? sanitizedData.username.toLowerCase() : email;

    // Check existing
    const existingAdmin = await Admin.findOne({
        $or: [
            ...(email ? [{ email }] : []),
            ...(username ? [{ username }] : [])
        ]
    });
    const existingUser = await User.findOne({ username });

    if (existingAdmin || existingUser) {
        throw new Error('User or email already exists');
    }

    const admin = await Admin.create({
        email: email || username,
        username: username || email,
        password: sanitizedData.password,
        role: sanitizedData.role || 'staff'
    });

    const token = exports.generateToken(admin);

    return {
        user: {
            id: admin._id,
            email: admin.email,
            username: admin.username,
            role: admin.role
        },
        token
    };
};

exports.loginUser = async (loginIdentifier, password) => {
    const identifier = (loginIdentifier || '').toLowerCase();

    // Find in Admin model first
    let account = await Admin.findOne({
        $or: [{ email: identifier }, { username: identifier }]
    }).select('+password');

    let isLegacyUser = false;
    if (!account) {
        account = await User.findOne({ username: identifier }).select('+password');
        isLegacyUser = true;
    }

    if (!account) {
        throw new Error('Invalid credentials');
    }

    if (!account.isActive) {
        throw new Error('Account is inactive');
    }

    // Check account lockout for Admin
    if (!isLegacyUser && account.isLocked) {
        throw new Error('Account is locked due to multiple failed login attempts. Please try again later.');
    }

    const isMatch = await account.comparePassword(password);
    if (!isMatch) {
        if (!isLegacyUser && account.incLoginAttempts) {
            await account.incLoginAttempts();
        }
        throw new Error('Invalid credentials');
    }

    // Successful login - reset failed attempts
    if (!isLegacyUser && account.resetLoginAttempts) {
        await account.resetLoginAttempts();
    }

    const token = exports.generateToken(account);

    return {
        user: {
            id: account._id,
            email: account.email,
            username: account.username,
            role: account.role
        },
        token
    };
};

exports.getUserById = async (id) => {
    let account = await Admin.findById(id);
    if (!account) {
        account = await User.findById(id);
    }
    return account;
};

exports.updatePassword = async (userId, currentPassword, newPassword) => {
    let account = await Admin.findById(userId).select('+password');
    if (!account) {
        account = await User.findById(userId).select('+password');
    }

    if (!account) {
        throw new Error('User not found');
    }

    const isMatch = await account.comparePassword(currentPassword);
    if (!isMatch) {
        throw new Error('Current password is incorrect');
    }

    account.password = newPassword;
    await account.save();

    return exports.generateToken(account);
};
