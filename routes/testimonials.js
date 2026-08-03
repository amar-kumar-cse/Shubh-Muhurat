const express = require('express');
const router = express.Router();
const testimonialController = require('../controllers/testimonialController');
const spamProtection = require('../middleware/spamProtection');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { testimonial } = require('../validators');

// Testimonial routes
router.get('/', testimonialController.getAllTestimonials); // Public - approved only
router.get('/admin', protect, authorize('admin'), testimonialController.getAllTestimonialsAdmin); // Admin - all testimonials
router.get('/rating', testimonialController.getAverageRating); // Public
router.get('/:id', testimonialController.getTestimonialById); // Public
router.post('/', validate(testimonial.createTestimonialSchema), spamProtection, testimonialController.createTestimonial); // Public - for testimonial form
router.put('/:id', protect, authorize('admin'), validate(testimonial.updateTestimonialSchema), testimonialController.updateTestimonial);
router.delete('/:id', protect, authorize('admin'), testimonialController.deleteTestimonial);

module.exports = router;
