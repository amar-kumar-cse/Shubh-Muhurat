const Booking = require('../models/Booking');
const { bookingStatus, eventTypes } = require('../constants');
const { pick } = require('../utils');
const crypto = require('node:crypto');
const { sendBookingConfirmation, sendBookingStatusUpdate } = require('../utils/sendEmail');
const Razorpay = require('razorpay');

const generateTrackingCode = () => crypto.randomBytes(5).toString('hex').toUpperCase();
const razorpay = process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET
    ? new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET
    })
    : null;

const bookingCreateFields = ['name', 'email', 'phone', 'eventType', 'guests', 'venue', 'date', 'requests', 'quoteId', 'depositAmount'];
const bookingUpdateFields = ['status', 'totalAmount', 'venue', 'date', 'requests', 'depositAmount', 'paymentLink', 'quoteId'];
const activeBookingStatuses = [bookingStatus.PENDING, bookingStatus.CONFIRMED];

const buildConflictQuery = ({ date, venue, excludeId }) => {
    const query = {
        date,
        venue,
        status: { $in: activeBookingStatuses }
    };

    if (excludeId) {
        query._id = { $ne: excludeId };
    }

    return query;
};

exports.getBookings = async (filters, pagination) => {
    const { page, limit, skip } = pagination;
    
    const bookings = await Booking.find(filters)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
    
    const total = await Booking.countDocuments(filters);
    
    return { bookings, total };
};

exports.getBookingById = async (id) => {
    return await Booking.findById(id);
};

exports.getBookingByTrackingCode = async (trackingCode) => {
    return Booking.findOne({ trackingCode }).populate('quoteId');
};

exports.getAvailability = async (month) => {
    const [year, monthIndex] = String(month || '').split('-').map(Number);
    if (!year || !monthIndex) {
        const error = new Error('Month must be provided in YYYY-MM format');
        error.statusCode = 400;
        throw error;
    }

    const startOfMonth = new Date(year, monthIndex - 1, 1);
    const endOfMonth = new Date(year, monthIndex, 0, 23, 59, 59, 999);

    const bookedDates = await Booking.find({
        status: { $in: activeBookingStatuses },
        date: { $gte: startOfMonth, $lte: endOfMonth }
    }).select('date venue status -_id').sort({ date: 1, venue: 1 });

    return { month: `${year}-${String(monthIndex).padStart(2, '0')}`, bookedDates };
};

exports.createBooking = async (bookingData) => {
    const allowedData = pick(bookingData, bookingCreateFields);
    const existingBooking = await Booking.findOne(buildConflictQuery(allowedData));

    if (existingBooking) {
        const conflictError = new Error('This date and venue is already booked');
        conflictError.statusCode = 409;
        throw conflictError;
    }

    const booking = new Booking({
        ...allowedData,
        trackingCode: generateTrackingCode()
    });

    const savedBooking = await booking.save();

    if (razorpay && savedBooking.depositAmount) {
        const order = await razorpay.orders.create({
            amount: Math.round(Number(savedBooking.depositAmount) * 100),
            currency: 'INR',
            receipt: savedBooking.trackingCode,
            notes: {
                bookingId: String(savedBooking._id)
            }
        });

        savedBooking.paymentLink = `razorpay-order:${order.id}`;
        await savedBooking.save();
    }

    await sendBookingConfirmation(savedBooking);
    return savedBooking;
};

exports.updateBooking = async (id, updateData) => {
    const allowedData = pick(updateData, bookingUpdateFields);
    const existingBooking = await Booking.findById(id);

    if (!existingBooking) {
        return null;
    }

    const nextBooking = {
        date: allowedData.date ?? existingBooking.date,
        venue: allowedData.venue ?? existingBooking.venue,
        status: allowedData.status ?? existingBooking.status
    };

    if (nextBooking.date && nextBooking.venue && activeBookingStatuses.includes(nextBooking.status)) {
        const conflictBooking = await Booking.findOne(buildConflictQuery({
            date: nextBooking.date,
            venue: nextBooking.venue,
            excludeId: id
        }));

        if (conflictBooking) {
            const conflictError = new Error('This date and venue is already booked');
            conflictError.statusCode = 409;
            throw conflictError;
        }
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
        id,
        allowedData,
        { new: true, runValidators: true }
    );

    if (updatedBooking && allowedData.status) {
        await sendBookingStatusUpdate(updatedBooking);
    }

    return updatedBooking;
};

exports.deleteBooking = async (id) => {
    return await Booking.findByIdAndDelete(id);
};

exports.getBookingStats = async () => {
    const stats = await Booking.aggregate([
        {
            $group: {
                _id: '$status',
                count: { $sum: 1 }
            }
        }
    ]);

    const result = { total: 0, pending: 0, confirmed: 0, completed: 0 };

    stats.forEach((stat) => {
        result.total += stat.count;

        if (typeof stat._id === 'string') {
            result[stat._id.toLowerCase()] = stat.count;
        }
    });
    
    return result;
};

exports.buildBookingFilter = (query) => {
    const filter = {};
    
    if (query.status && bookingStatus.ALL.includes(query.status)) {
        filter.status = query.status;
    }
    
    if (query.eventType && eventTypes.ALL.includes(query.eventType)) {
        filter.eventType = query.eventType;
    }

    if (query.venue) {
        filter.venue = query.venue.trim();
    }
    
    if (query.dateFrom || query.dateTo) {
        filter.date = {};
        if (query.dateFrom) {
            const dateFrom = new Date(query.dateFrom);
            if (!isNaN(dateFrom.getTime())) filter.date.$gte = dateFrom;
        }
        if (query.dateTo) {
            const dateTo = new Date(query.dateTo);
            if (!isNaN(dateTo.getTime())) filter.date.$lte = dateTo;
        }
    }
    
    return filter;
};

