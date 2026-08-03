const Joi = require('joi');
const { priority } = require('../constants');

exports.createInquirySchema = Joi.object({
    name: Joi.string().min(2).max(100).required().messages({
        'string.min': 'Name must be at least 2 characters long',
        'string.max': 'Name cannot exceed 100 characters',
        'any.required': 'Name is required'
    }),
    email: Joi.string().email().required().messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required'
    }),
    phone: Joi.string().pattern(/^[\d\s\+\-\(\)]+$/).min(10).max(20).required().messages({
        'string.pattern.base': 'Please provide a valid phone number',
        'string.min': 'Phone number must be at least 10 digits',
        'string.max': 'Phone number cannot exceed 20 characters',
        'any.required': 'Phone number is required'
    }),
    subject: Joi.string().min(5).max(200).required().messages({
        'string.min': 'Subject must be at least 5 characters long',
        'string.max': 'Subject cannot exceed 200 characters',
        'any.required': 'Subject is required'
    }),
    message: Joi.string().min(10).max(2000).required().messages({
        'string.min': 'Message must be at least 10 characters long',
        'string.max': 'Message cannot exceed 2000 characters',
        'any.required': 'Message is required'
    }),
    priority: Joi.string().valid(...priority.ALL).optional()
});

exports.updateInquirySchema = Joi.object({
    status: Joi.string().valid('New', 'Read', 'In Progress', 'Resolved').optional(),
    priority: Joi.string().valid(...priority.ALL).optional(),
    notes: Joi.string().max(500).allow('').optional()
}).min(1).messages({
    'object.min': 'At least one field must be provided for update'
});
