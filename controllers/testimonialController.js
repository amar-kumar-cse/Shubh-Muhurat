const services = require('../services');
const { pagination } = require('../utils');

// Get all testimonials (approved only for public)
exports.getAllTestimonials = async (req, res, next) => {
    try {
        const { page, limit, skip } = pagination.getPagination(req.query);
        const filter = services.testimonial.buildPublicTestimonialFilter(req.query);
        const { testimonials, total } = await services.testimonial.getTestimonials(filter, { page, limit, skip });
        const paginationMeta = pagination.buildPaginationMeta(total, page, limit);

        res.json({
            success: true,
            data: testimonials,
            pagination: paginationMeta
        });
    } catch (error) {
        next(error);
    }
};

// Get all testimonials (admin - includes unapproved)
exports.getAllTestimonialsAdmin = async (req, res, next) => {
    try {
        const { page, limit, skip } = pagination.getPagination(req.query);
        const filter = services.testimonial.buildAdminTestimonialFilter(req.query);
        const { testimonials, total } = await services.testimonial.getTestimonials(filter, { page, limit, skip });
        const paginationMeta = pagination.buildPaginationMeta(total, page, limit);

        res.json({
            success: true,
            data: testimonials,
            pagination: paginationMeta
        });
    } catch (error) {
        next(error);
    }
};

// Get single testimonial by ID
exports.getTestimonialById = async (req, res, next) => {
    try {
        const testimonial = await services.testimonial.getTestimonialById(req.params.id);

        if (!testimonial) {
            return res.status(404).json({
                success: false,
                message: 'Testimonial not found'
            });
        }

        res.json({
            success: true,
            data: testimonial
        });
    } catch (error) {
        next(error);
    }
};

// Create new testimonial
exports.createTestimonial = async (req, res, next) => {
    try {
        const newTestimonial = await services.testimonial.createTestimonial(req.body);

        res.status(201).json({
            success: true,
            message: 'Thank you for your feedback! Your testimonial will be reviewed and published soon.',
            data: newTestimonial
        });
    } catch (error) {
        next(error);
    }
};

// Update testimonial by ID
exports.updateTestimonial = async (req, res, next) => {
    try {
        const testimonial = await services.testimonial.updateTestimonial(req.params.id, req.body);

        if (!testimonial) {
            return res.status(404).json({
                success: false,
                message: 'Testimonial not found'
            });
        }

        res.json({
            success: true,
            message: 'Testimonial updated successfully',
            data: testimonial
        });
    } catch (error) {
        next(error);
    }
};

// Delete testimonial by ID
exports.deleteTestimonial = async (req, res, next) => {
    try {
        const testimonial = await services.testimonial.deleteTestimonial(req.params.id);

        if (!testimonial) {
            return res.status(404).json({
                success: false,
                message: 'Testimonial not found'
            });
        }

        res.json({
            success: true,
            message: 'Testimonial deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

// Get average rating
exports.getAverageRating = async (req, res, next) => {
    try {
        const rating = await services.testimonial.getAverageRating();

        res.json({
            success: true,
            data: rating
        });
    } catch (error) {
        next(error);
    }
};
