const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const spamProtection = require('../middleware/spamProtection');
const createSubmissionLimiter = require('../middleware/publicSubmissionLimiter');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { contact } = require('../validators');

const contactSubmissionLimiter = createSubmissionLimiter('Too many contact submissions. Please wait a few minutes before trying again.');

// Contact inquiry routes
router.get('/', protect, authorize('admin', 'staff'), contactController.getAllInquiries);
router.get('/stats', protect, authorize('admin'), contactController.getInquiryStats);
router.get('/:id', protect, authorize('admin', 'staff'), contactController.getInquiryById);
router.post('/', contactSubmissionLimiter, validate(contact.createInquirySchema), spamProtection, contactController.createInquiry); // Public - for contact form
router.put('/:id', protect, authorize('admin'), validate(contact.updateInquirySchema), contactController.updateInquiry);
router.delete('/:id', protect, authorize('admin'), contactController.deleteInquiry);

module.exports = router;
