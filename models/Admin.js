const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true
    },
    username: {
        type: String,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters long'],
        select: false
    },
    role: {
        type: String,
        enum: ['admin', 'staff'],
        default: 'staff'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    failedLoginAttempts: {
        type: Number,
        default: 0
    },
    lockUntil: {
        type: Date
    }
}, {
    timestamps: true
});

// Hash password securely with cost factor 12 before saving
adminSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    try {
        this.password = await bcrypt.hash(this.password, 12);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare candidate password
adminSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Virtual property to check if account is currently locked
adminSchema.virtual('isLocked').get(function () {
    return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Helper method to handle failed login attempts
adminSchema.methods.incLoginAttempts = async function () {
    // If previous lock has expired, reset attempts counter
    if (this.lockUntil && this.lockUntil < Date.now()) {
        return await this.updateOne({
            $set: { failedLoginAttempts: 1 },
            $unset: { lockUntil: 1 }
        });
    }

    const updates = { $inc: { failedLoginAttempts: 1 } };
    // Lock account for 15 minutes after 5 failed attempts
    if (this.failedLoginAttempts + 1 >= 5 && !this.isLocked) {
        updates.$set = { lockUntil: new Date(Date.now() + 15 * 60 * 1000) };
    }

    return await this.updateOne(updates);
};

// Helper method to reset login attempts after successful login
adminSchema.methods.resetLoginAttempts = async function () {
    return await this.updateOne({
        $set: { failedLoginAttempts: 0 },
        $unset: { lockUntil: 1 }
    });
};

module.exports = mongoose.model('Admin', adminSchema);
