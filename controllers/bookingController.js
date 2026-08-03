const services = require('../services');
const { pagination } = require('../utils');

// Get all bookings with pagination and filtering
exports.getAllBookings = async (req, res, next) => {
    try {
        const { page, limit, skip } = pagination.getPagination(req.query);
        const filter = services.booking.buildBookingFilter(req.query);
        const { bookings, total } = await services.booking.getBookings(filter, { page, limit, skip });
        const paginationMeta = pagination.buildPaginationMeta(total, page, limit);

        res.json({
            success: true,
            data: bookings,
            pagination: paginationMeta
        });
    } catch (error) {
        next(error);
    }
};

// Get single booking by ID
exports.getBookingById = async (req, res, next) => {
    try {
        const booking = await services.booking.getBookingById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        res.json({
            success: true,
            data: booking
        });
    } catch (error) {
        next(error);
    }
};

// Create new booking
exports.createBooking = async (req, res, next) => {
    try {
        const newBooking = await services.booking.createBooking(req.body);

        res.status(201).json({
            success: true,
            message: 'Booking created successfully!',
            data: newBooking
        });
    } catch (error) {
        next(error);
    }
};

// Update booking by ID
exports.updateBooking = async (req, res, next) => {
    try {
        const booking = await services.booking.updateBooking(req.params.id, req.body);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        res.json({
            success: true,
            message: 'Booking updated successfully',
            data: booking
        });
    } catch (error) {
        next(error);
    }
};

// Delete booking by ID
exports.deleteBooking = async (req, res, next) => {
    try {
        const booking = await services.booking.deleteBooking(req.params.id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        res.json({
            success: true,
            message: 'Booking deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

// Get booking statistics
exports.getBookingStats = async (req, res, next) => {
    try {
        const stats = await services.booking.getBookingStats();

        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        next(error);
    }
};
