const Booking = require('../models/Booking');
const { bookingStatus, eventTypes } = require('../constants');
const { pick } = require('../utils');

const bookingCreateFields = ['name', 'email', 'phone', 'eventType', 'guests', 'venue', 'date', 'requests'];
const bookingUpdateFields = ['status', 'totalAmount', 'venue', 'date', 'requests'];
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

exports.createBooking = async (bookingData) => {
    const allowedData = pick(bookingData, bookingCreateFields);
    const existingBooking = await Booking.findOne(buildConflictQuery(allowedData));

    if (existingBooking) {
        const conflictError = new Error('This date and venue is already booked');
        conflictError.statusCode = 409;
        throw conflictError;
    }

    const booking = new Booking(allowedData);
    return await booking.save();
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

    return await Booking.findByIdAndUpdate(
        id,
        allowedData,
        { new: true, runValidators: true }
    );
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
