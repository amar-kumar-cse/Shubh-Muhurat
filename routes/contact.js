const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

// Contact inquiry routes
router.get('/', contactController.getAllInquiries);
router.get('/stats', contactController.getInquiryStats);
router.get('/:id', contactController.getInquiryById);
router.post('/', contactController.createInquiry);
router.put('/:id', contactController.updateInquiry);
router.delete('/:id', contactController.deleteInquiry);

module.exports = router;
