const mongoose = require('mongoose');

const quoteItemSchema = new mongoose.Schema({
    menuItem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MenuItem',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    }
}, { _id: false });

const quoteSchema = new mongoose.Schema({
    bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking'
    },
    selectedItems: {
        type: [quoteItemSchema],
        default: []
    },
    guestCount: {
        type: Number,
        required: true,
        min: 1
    },
    estimatedTotal: {
        type: Number,
        required: true,
        min: 0
    }
}, {
    timestamps: true
});

quoteSchema.index({ bookingId: 1 });

module.exports = mongoose.model('Quote', quoteSchema);