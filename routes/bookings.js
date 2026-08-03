const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const spamProtection = require('../middleware/spamProtection');
const createSubmissionLimiter = require('../middleware/publicSubmissionLimiter');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { booking } = require('../validators');

const bookingSubmissionLimiter = createSubmissionLimiter('Too many booking submissions. Please wait a few minutes before trying again.');

// Booking routes
router.get('/availability', bookingController.getAvailability);
router.get('/', protect, authorize('admin', 'staff'), bookingController.getAllBookings);
router.get('/stats', protect, authorize('admin'), bookingController.getBookingStats);
router.get('/track/:trackingCode', bookingController.trackBooking);
router.get('/:id', protect, authorize('admin', 'staff'), bookingController.getBookingById);
router.post('/', bookingSubmissionLimiter, validate(booking.createBookingSchema), spamProtection, bookingController.createBooking); // Public - for booking form
router.put('/:id', protect, authorize('admin'), validate(booking.updateBookingSchema), bookingController.updateBooking);
router.delete('/:id', protect, authorize('admin'), bookingController.deleteBooking);

module.exports = router;
