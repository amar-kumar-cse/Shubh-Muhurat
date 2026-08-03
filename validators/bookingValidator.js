const Joi = require('joi');
const { eventTypes } = require('../constants');

exports.createBookingSchema = Joi.object({
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
    eventType: Joi.string().valid(...eventTypes.ALL).required().messages({
        'any.only': `Event type must be one of: ${eventTypes.ALL.join(', ')}`,
        'any.required': 'Event type is required'
    }),
    guests: Joi.number().integer().min(1).max(10000).required().messages({
        'number.min': 'Must have at least 1 guest',
        'number.max': 'Guest count cannot exceed 10000',
        'any.required': 'Number of guests is required'
    }),
    venue: Joi.string().min(2).max(150).required().messages({
        'string.min': 'Venue must be at least 2 characters long',
        'string.max': 'Venue cannot exceed 150 characters',
        'any.required': 'Venue is required'
    }),
    date: Joi.date().greater('now').required().messages({
        'date.greater': 'Event date must be in the future',
        'any.required': 'Event date is required'
    }),
    requests: Joi.string().max(500).allow('').optional().messages({
        'string.max': 'Special requests cannot exceed 500 characters'
    })
});

exports.updateBookingSchema = Joi.object({
    venue: Joi.string().min(2).max(150).optional(),
    status: Joi.string().valid('Pending', 'Confirmed', 'Cancelled', 'Completed').optional(),
    totalAmount: Joi.number().min(0).optional()
}).min(1).messages({
    'object.min': 'At least one field must be provided for update'
});
