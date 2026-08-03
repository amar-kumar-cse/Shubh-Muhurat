const services = require('../services');
const { pagination } = require('../utils');

// Get all contact inquiries
exports.getAllInquiries = async (req, res, next) => {
    try {
        const { page, limit, skip } = pagination.getPagination(req.query);
        const filter = services.contact.buildContactFilter(req.query);
        const { inquiries, total } = await services.contact.getInquiries(filter, { page, limit, skip });
        const paginationMeta = pagination.buildPaginationMeta(total, page, limit);

        res.json({
            success: true,
            data: inquiries,
            pagination: paginationMeta
        });
    } catch (error) {
        next(error);
    }
};

// Get single inquiry by ID
exports.getInquiryById = async (req, res, next) => {
    try {
        const inquiry = await services.contact.getInquiryById(req.params.id);

        if (!inquiry) {
            return res.status(404).json({
                success: false,
                message: 'Inquiry not found'
            });
        }

        res.json({
            success: true,
            data: inquiry
        });
    } catch (error) {
        next(error);
    }
};

// Create new contact inquiry
exports.createInquiry = async (req, res, next) => {
    try {
        const newInquiry = await services.contact.createInquiry(req.body);

        res.status(201).json({
            success: true,
            message: 'Thank you for contacting us! We will get back to you soon.',
            data: newInquiry
        });
    } catch (error) {
        next(error);
    }
};

// Update inquiry by ID
exports.updateInquiry = async (req, res, next) => {
    try {
        const inquiry = await services.contact.updateInquiry(req.params.id, req.body);

        if (!inquiry) {
            return res.status(404).json({
                success: false,
                message: 'Inquiry not found'
            });
        }

        res.json({
            success: true,
            message: 'Inquiry updated successfully',
            data: inquiry
        });
    } catch (error) {
        next(error);
    }
};

// Delete inquiry by ID
exports.deleteInquiry = async (req, res, next) => {
    try {
        const inquiry = await services.contact.deleteInquiry(req.params.id);

        if (!inquiry) {
            return res.status(404).json({
                success: false,
                message: 'Inquiry not found'
            });
        }

        res.json({
            success: true,
            message: 'Inquiry deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

// Get inquiry statistics
exports.getInquiryStats = async (req, res, next) => {
    try {
        const stats = await services.contact.getInquiryStats();

        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        next(error);
    }
};
