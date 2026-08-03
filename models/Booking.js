const mongoose = require('mongoose');
const { bookingStatus, eventTypes } = require('../constants');

const bookingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters long']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true,
        match: [/^[\d\s\+\-\(\)]+$/, 'Please provide a valid phone number']
    },
    eventType: {
        type: String,
        required: [true, 'Event type is required'],
        enum: {
            values: eventTypes.ALL,
            message: '{VALUE} is not a valid event type'
        }
    },
    guests: {
        type: Number,
        required: [true, 'Number of guests is required'],
        min: [1, 'Must have at least 1 guest'],
        max: [10000, 'Guest count cannot exceed 10000']
    },
    venue: {
        type: String,
        required: [true, 'Venue is required'],
        trim: true,
        minlength: [2, 'Venue must be at least 2 characters long'],
        maxlength: [150, 'Venue cannot exceed 150 characters']
    },
    date: {
        type: Date,
        required: [true, 'Event date is required'],
        validate: {
            validator: function(value) {
                return value > new Date();
            },
            message: 'Event date must be in the future'
        }
    },
    requests: {
        type: String,
        trim: true,
        maxlength: [500, 'Special requests cannot exceed 500 characters']
    },
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Cancelled', 'Completed'],
        default: 'Pending'
    },
    totalAmount: {
        type: Number,
        min: 0
    },
    trackingCode: {
        type: String,
        unique: true,
        sparse: true,
        trim: true
    },
    quoteId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quote'
    },
    depositAmount: {
        type: Number,
        min: 0
    },
    paymentLink: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

// Index for better query performance
bookingSchema.index({ date: 1, venue: 1, status: 1 });
bookingSchema.index({ email: 1 });
bookingSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Booking', bookingSchema);
