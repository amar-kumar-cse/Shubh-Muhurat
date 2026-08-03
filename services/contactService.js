const ContactInquiry = require('../models/ContactInquiry');
const { contactStatus, priority } = require('../constants');
const { pick } = require('../utils');

const createFields = ['name', 'email', 'phone', 'subject', 'message'];
const updateFields = ['status', 'priority', 'notes'];

exports.getInquiries = async (filters, pagination) => {
    const { page, limit, skip } = pagination;
    
    const inquiries = await ContactInquiry.find(filters)
        .sort({ priority: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit);
    
    const total = await ContactInquiry.countDocuments(filters);
    
    return { inquiries, total };
};

exports.getInquiryById = async (id) => {
    return await ContactInquiry.findById(id);
};

exports.createInquiry = async (inquiryData) => {
    const inquiry = new ContactInquiry(pick(inquiryData, createFields));
    return await inquiry.save();
};

exports.updateInquiry = async (id, updateData) => {
    return await ContactInquiry.findByIdAndUpdate(
        id,
        pick(updateData, updateFields),
        { new: true, runValidators: true }
    );
};

exports.deleteInquiry = async (id) => {
    return await ContactInquiry.findByIdAndDelete(id);
};

exports.getInquiryStats = async () => {
    const stats = await ContactInquiry.aggregate([
        {
            $group: {
                _id: '$status',
                count: { $sum: 1 }
            }
        }
    ]);

    const result = { total: 0, new: 0, inProgress: 0, resolved: 0 };

    stats.forEach((stat) => {
        result.total += stat.count;

        if (stat._id === contactStatus.NEW) {
            result.new = stat.count;
        }

        if (stat._id === contactStatus.IN_PROGRESS) {
            result.inProgress = stat.count;
        }

        if (stat._id === contactStatus.RESOLVED) {
            result.resolved = stat.count;
        }
    });
    
    return result;
};

exports.buildContactFilter = (query) => {
    const filter = {};
    
    if (query.status && contactStatus.ALL.includes(query.status)) {
        filter.status = query.status;
    }
    
    if (query.priority && priority.ALL.includes(query.priority)) {
        filter.priority = query.priority;
    }
    
    return filter;
};
