const Joi = require('joi');

exports.registerSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required().messages({
        'string.alphanum': 'Username must only contain alphanumeric characters',
        'string.min': 'Username must be at least 3 characters long',
        'string.max': 'Username cannot exceed 30 characters',
        'any.required': 'Username is required'
    }),
    password: Joi.string().min(6).max(100).required().messages({
        'string.min': 'Password must be at least 6 characters long',
        'string.max': 'Password cannot exceed 100 characters',
        'any.required': 'Password is required'
    }),
    role: Joi.string().valid('admin', 'staff').optional()
});

exports.loginSchema = Joi.object({
    username: Joi.string().required().messages({
        'any.required': 'Username is required'
    }),
    password: Joi.string().required().messages({
        'any.required': 'Password is required'
    })
});

exports.updatePasswordSchema = Joi.object({
    currentPassword: Joi.string().required().messages({
        'any.required': 'Current password is required'
    }),
    newPassword: Joi.string().min(6).max(100).required().messages({
        'string.min': 'New password must be at least 6 characters long',
        'string.max': 'New password cannot exceed 100 characters',
        'any.required': 'New password is required'
    })
});
