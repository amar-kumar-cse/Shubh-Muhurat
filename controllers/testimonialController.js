const Testimonial = require('../models/Testimonial');

// Get all testimonials (approved only for public)
exports.getAllTestimonials = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = Math.min(parseInt(req.query.limit) || 10, 100);
        const skip = (page - 1) * limit;

        // Build filter - only show approved for public, sanitize to prevent NoSQL injection
        const filter = { isApproved: true };
        const allowedEventTypes = ['Wedding', 'Corporate Event', 'Birthday Party', 'Anniversary', 'Private Party', 'Other'];
        if (req.query.eventType && allowedEventTypes.includes(req.query.eventType)) {
            filter.eventType = req.query.eventType;
        }
        if (req.query.rating) {
            const rating = parseInt(req.query.rating);
            if (!isNaN(rating) && rating >= 1 && rating <= 5) filter.rating = { $gte: rating };
        }
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
        next(error);
    }
};

// Get all testimonials (admin - includes unapproved)
exports.getAllTestimonialsAdmin = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = Math.min(parseInt(req.query.limit) || 20, 100);
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
        next(error);
    }
};

// Get single testimonial by ID
exports.getTestimonialById = async (req, res, next) => {
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
        next(error);
    }
};

// Create new testimonial
exports.createTestimonial = async (req, res, next) => {
    try {
        const newTestimonial = new Testimonial(req.body);
        await newTestimonial.save();

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
        const testimonial = await Testimonial.findByIdAndUpdate(
            req.params.id,
            req.body,
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
        next(error);
    }
};

// Delete testimonial by ID
exports.deleteTestimonial = async (req, res, next) => {
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
        next(error);
    }
};

// Get average rating
exports.getAverageRating = async (req, res, next) => {
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
        next(error);
    }
};
