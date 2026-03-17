const express = require('express');
const router = express.Router();
const testimonialController = require('../controllers/testimonialController');

// Testimonial routes
router.get('/', testimonialController.getAllTestimonials); // Public - approved only
router.get('/admin', testimonialController.getAllTestimonialsAdmin); // Admin - all testimonials
router.get('/rating', testimonialController.getAverageRating);
router.get('/:id', testimonialController.getTestimonialById);
router.post('/', testimonialController.createTestimonial);
router.put('/:id', testimonialController.updateTestimonial);
router.delete('/:id', testimonialController.deleteTestimonial);

module.exports = router;
