const ContactInquiry = require('../models/ContactInquiry');

// Get all contact inquiries
exports.getAllInquiries = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = Math.min(parseInt(req.query.limit) || 20, 100);
        const skip = (page - 1) * limit;

        // Build filter - sanitize to prevent NoSQL injection
        const filter = {};
        const allowedStatuses = ['New', 'Read', 'In Progress', 'Resolved'];
        if (req.query.status && allowedStatuses.includes(req.query.status)) {
            filter.status = req.query.status;
        }
        const allowedPriorities = ['Low', 'Medium', 'High', 'Urgent'];
        if (req.query.priority && allowedPriorities.includes(req.query.priority)) {
            filter.priority = req.query.priority;
        }

        const inquiries = await ContactInquiry.find(filter)
            .sort({ priority: -1, createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await ContactInquiry.countDocuments(filter);

        res.json({
            success: true,
            data: inquiries,
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

// Get single inquiry by ID
exports.getInquiryById = async (req, res, next) => {
    try {
        const inquiry = await ContactInquiry.findById(req.params.id);

        if (!inquiry) {
            return res.status(404).json({
                success: false,
                message: 'Inquiry not found'
            });
        }

        // Update status to 'Read' if it was 'New'
        if (inquiry.status === 'New') {
            inquiry.status = 'Read';
            await inquiry.save();
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
        const newInquiry = new ContactInquiry(req.body);
        await newInquiry.save();

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
        const inquiry = await ContactInquiry.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

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
        const inquiry = await ContactInquiry.findByIdAndDelete(req.params.id);

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
        const totalInquiries = await ContactInquiry.countDocuments();
        const newInquiries = await ContactInquiry.countDocuments({ status: 'New' });
        const inProgressInquiries = await ContactInquiry.countDocuments({ status: 'In Progress' });
        const resolvedInquiries = await ContactInquiry.countDocuments({ status: 'Resolved' });

        res.json({
            success: true,
            data: {
                total: totalInquiries,
                new: newInquiries,
                inProgress: inProgressInquiries,
                resolved: resolvedInquiries
            }
        });
    } catch (error) {
        next(error);
    }
};
