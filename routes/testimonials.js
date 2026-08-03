const express = require('express');
const router = express.Router();
const testimonialController = require('../controllers/testimonialController');
const spamProtection = require('../middleware/spamProtection');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { testimonial } = require('../validators');

// Testimonial routes
router.get('/', testimonialController.getAllTestimonials); // Public - approved only (no PII)
router.get('/admin', protect, authorize('admin', 'staff'), testimonialController.getAllTestimonialsAdmin); // Admin & Staff - all testimonials
router.get('/rating', testimonialController.getAverageRating); // Public
router.get('/:id', testimonialController.getTestimonialById); // Public
router.post('/', validate(testimonial.createTestimonialSchema), spamProtection, testimonialController.createTestimonial); // Public - for testimonial form
router.put('/:id', protect, authorize('admin', 'staff'), validate(testimonial.updateTestimonialSchema), testimonialController.updateTestimonial);
router.delete('/:id', protect, authorize('admin'), testimonialController.deleteTestimonial);

module.exports = router;
