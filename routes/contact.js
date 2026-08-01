const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const spamProtection = require('../middleware/spamProtection');
const { protect, authorize } = require('../middleware/auth');

// Contact inquiry routes
router.get('/', protect, authorize('admin', 'staff'), contactController.getAllInquiries);
router.get('/stats', protect, authorize('admin'), contactController.getInquiryStats);
router.get('/:id', protect, authorize('admin', 'staff'), contactController.getInquiryById);
router.post('/', spamProtection, contactController.createInquiry); // Public - for contact form
router.put('/:id', protect, authorize('admin'), contactController.updateInquiry);
router.delete('/:id', protect, authorize('admin'), contactController.deleteInquiry);

module.exports = router;
