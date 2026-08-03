const Testimonial = require('../models/Testimonial');
const { eventTypes } = require('../constants');
const { pick } = require('../utils');

const createFields = ['name', 'email', 'rating', 'comment', 'eventType', 'eventDate', 'location'];
const updateFields = ['isApproved', 'isFeatured'];

exports.getTestimonials = async (filters, pagination) => {
    const { page, limit, skip } = pagination;
    
    const testimonials = await Testimonial.find(filters)
        .sort({ isFeatured: -1, rating: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('-email');
    
    const total = await Testimonial.countDocuments(filters);
    
    return { testimonials, total };
};

exports.getTestimonialById = async (id) => {
    return await Testimonial.findById(id);
};

exports.createTestimonial = async (testimonialData) => {
    const testimonial = new Testimonial(pick(testimonialData, createFields));
    return await testimonial.save();
};

exports.updateTestimonial = async (id, updateData) => {
    return await Testimonial.findByIdAndUpdate(
        id,
        pick(updateData, updateFields),
        { new: true, runValidators: true }
    );
};

exports.deleteTestimonial = async (id) => {
    return await Testimonial.findByIdAndDelete(id);
};

exports.getAverageRating = async () => {
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
    
    if (result.length > 0) {
        return {
            averageRating: result[0].averageRating.toFixed(1),
            totalReviews: result[0].totalReviews
        };
    }
    
    return { averageRating: 0, totalReviews: 0 };
};

exports.buildPublicTestimonialFilter = (query) => {
    const filter = { isApproved: true };
    
    if (query.eventType && eventTypes.ALL.includes(query.eventType)) {
        filter.eventType = query.eventType;
    }
    
    if (query.rating) {
        const rating = parseInt(query.rating);
        if (!isNaN(rating) && rating >= 1 && rating <= 5) {
            filter.rating = { $gte: rating };
        }
    }
    
    if (query.isFeatured !== undefined) {
        filter.isFeatured = query.isFeatured === 'true';
    }
    
    return filter;
};

exports.buildAdminTestimonialFilter = (query) => {
    const filter = {};
    
    if (query.isApproved !== undefined) {
        filter.isApproved = query.isApproved === 'true';
    }
    
    return filter;
};
