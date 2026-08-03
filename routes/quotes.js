const express = require('express');
const router = express.Router();
const quoteController = require('../controllers/quoteController');
const { protect, authorize } = require('../middleware/auth');

router.post('/estimate', quoteController.calculateQuote);
router.post('/', protect, authorize('admin', 'staff'), quoteController.createQuote);
router.get('/booking/:bookingId', protect, authorize('admin', 'staff'), quoteController.getQuoteByBookingId);

module.exports = router;