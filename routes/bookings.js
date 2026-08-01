const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const spamProtection = require('../middleware/spamProtection');
const { protect, authorize } = require('../middleware/auth');

// Booking routes
router.get('/', protect, authorize('admin', 'staff'), bookingController.getAllBookings);
router.get('/stats', protect, authorize('admin'), bookingController.getBookingStats);
router.get('/:id', protect, authorize('admin', 'staff'), bookingController.getBookingById);
router.post('/', spamProtection, bookingController.createBooking); // Public - for booking form
router.put('/:id', protect, authorize('admin'), bookingController.updateBooking);
router.delete('/:id', protect, authorize('admin'), bookingController.deleteBooking);

module.exports = router;
