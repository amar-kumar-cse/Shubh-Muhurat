const Booking = require('../models/Booking');

// Get all bookings with pagination and filtering
exports.getAllBookings = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = Math.min(parseInt(req.query.limit) || 10, 100);
        const skip = (page - 1) * limit;

        // Build filter object - sanitize to prevent NoSQL injection
        const filter = {};
        const allowedStatuses = ['Pending', 'Confirmed', 'Cancelled', 'Completed'];
        if (req.query.status && allowedStatuses.includes(req.query.status)) {
            filter.status = req.query.status;
        }
        const allowedEventTypes = ['Wedding', 'Corporate Event', 'Birthday Party', 'Anniversary', 'Private Party', 'Other'];
        if (req.query.eventType && allowedEventTypes.includes(req.query.eventType)) {
            filter.eventType = req.query.eventType;
        }
        if (req.query.dateFrom || req.query.dateTo) {
            filter.date = {};
            if (req.query.dateFrom) {
                const dateFrom = new Date(req.query.dateFrom);
                if (!isNaN(dateFrom.getTime())) filter.date.$gte = dateFrom;
            }
            if (req.query.dateTo) {
                const dateTo = new Date(req.query.dateTo);
                if (!isNaN(dateTo.getTime())) filter.date.$lte = dateTo;
            }
        }

        const bookings = await Booking.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Booking.countDocuments(filter);

        res.json({
            success: true,
            data: bookings,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalItems: total,
                itemsPerPage: limit
            }
        });
    } catch (error) {
        next(error);
    }
};

// Get single booking by ID
exports.getBookingById = async (req, res, next) => {
    try {
        const booking = await Booking.findById(req.params.id);

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
        const newBooking = new Booking(req.body);
        await newBooking.save();

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
        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

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
        const booking = await Booking.findByIdAndDelete(req.params.id);

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
        const totalBookings = await Booking.countDocuments();
        const pendingBookings = await Booking.countDocuments({ status: 'Pending' });
        const confirmedBookings = await Booking.countDocuments({ status: 'Confirmed' });
        const completedBookings = await Booking.countDocuments({ status: 'Completed' });

        res.json({
            success: true,
            data: {
                total: totalBookings,
                pending: pendingBookings,
                confirmed: confirmedBookings,
                completed: completedBookings
            }
        });
    } catch (error) {
        next(error);
    }
};
