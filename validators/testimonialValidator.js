const Joi = require('joi');
const { eventTypes } = require('../constants');

exports.createTestimonialSchema = Joi.object({
    name: Joi.string().min(2).max(100).required().messages({
        'string.min': 'Name must be at least 2 characters long',
        'string.max': 'Name cannot exceed 100 characters',
        'any.required': 'Name is required'
    }),
    email: Joi.string().email().required().messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required'
    }),
    rating: Joi.number().integer().min(1).max(5).required().messages({
        'number.min': 'Rating must be at least 1',
        'number.max': 'Rating cannot exceed 5',
        'any.required': 'Rating is required'
    }),
    comment: Joi.string().min(10).max(1000).required().messages({
        'string.min': 'Comment must be at least 10 characters long',
        'string.max': 'Comment cannot exceed 1000 characters',
        'any.required': 'Comment is required'
    }),
    eventType: Joi.string().valid(...eventTypes.ALL).optional(),
    eventDate: Joi.date().optional()
});

exports.updateTestimonialSchema = Joi.object({
    isApproved: Joi.boolean().optional(),
    isFeatured: Joi.boolean().optional()
}).min(1).messages({
    'object.min': 'At least one field must be provided for update'
});
