const Testimonial = require('../models/Testimonial');

// Get all testimonials (approved only for public)
exports.getAllTestimonials = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Build filter - only show approved for public
        const filter = { isApproved: true };
        if (req.query.eventType) filter.eventType = req.query.eventType;
        if (req.query.rating) filter.rating = { $gte: parseInt(req.query.rating) };
        if (req.query.isFeatured !== undefined) filter.isFeatured = req.query.isFeatured === 'true';

        const testimonials = await Testimonial.find(filter)
            .sort({ isFeatured: -1, rating: -1, createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .select('-email'); // Don't expose email addresses

        const total = await Testimonial.countDocuments(filter);

        res.json({
            success: true,
            data: testimonials,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalItems: total,
                itemsPerPage: limit
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching testimonials',
            error: error.message
        });
    }
};

// Get all testimonials (admin - includes unapproved)
exports.getAllTestimonialsAdmin = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const filter = {};
        if (req.query.isApproved !== undefined) filter.isApproved = req.query.isApproved === 'true';

        const testimonials = await Testimonial.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Testimonial.countDocuments(filter);

        res.json({
            success: true,
            data: testimonials,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalItems: total,
                itemsPerPage: limit
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching testimonials',
            error: error.message
        });
    }
};

// Get single testimonial by ID
exports.getTestimonialById = async (req, res) => {
    try {
        const testimonial = await Testimonial.findById(req.params.id);

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
        res.status(500).json({
            success: false,
            message: 'Error fetching testimonial',
            error: error.message
        });
    }
};

// Create new testimonial
exports.createTestimonial = async (req, res) => {
    try {
        const newTestimonial = new Testimonial(req.body);
        await newTestimonial.save();

        res.status(201).json({
            success: true,
            message: 'Thank you for your feedback! Your testimonial will be reviewed and published soon.',
            data: newTestimonial
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: Object.values(error.errors).map(err => err.message)
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error creating testimonial',
            error: error.message
        });
    }
};

// Update testimonial by ID
exports.updateTestimonial = async (req, res) => {
    try {
        const testimonial = await Testimonial.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updatedAt: Date.now() },
            { new: true, runValidators: true }
        );

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
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: Object.values(error.errors).map(err => err.message)
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error updating testimonial',
            error: error.message
        });
    }
};

// Delete testimonial by ID
exports.deleteTestimonial = async (req, res) => {
    try {
        const testimonial = await Testimonial.findByIdAndDelete(req.params.id);

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
        res.status(500).json({
            success: false,
            message: 'Error deleting testimonial',
            error: error.message
        });
    }
};

// Get average rating
exports.getAverageRating = async (req, res) => {
    try {
        const result = await Testimonial.aggregate([
            { $match: { isApproved: true } },
            {
                $group: {
                    _id: null,
                    averageRating: { $avg: '$rating' },
                    totalReviews: { $sum: 1 }
                }
            }
        ]);

        res.json({
            success: true,
            data: result.length > 0 ? {
                averageRating: result[0].averageRating.toFixed(1),
                totalReviews: result[0].totalReviews
            } : {
                averageRating: 0,
                totalReviews: 0
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching rating statistics',
            error: error.message
        });
    }
};
