// Spam protection middleware for public forms
const spamProtection = (req, res, next) => {
    // Check for honeypot field (should be empty if legitimate request)
    if (req.body.honeypot && req.body.honeypot !== '') {
        return res.status(400).json({
            success: false,
            message: 'Invalid submission'
        });
    }

    // Check for common spam patterns in text fields
    const textFields = ['name', 'message', 'comment', 'requests', 'subject', 'notes'];
    const spamPatterns = [
        /viagra|cialis|casino|poker|lottery|winner/i,
        /http:\/\/|https:\/\/|www\./i, // URLs in unexpected fields
        /\[url\]|\[link\]|\[a href/i, // BBCode spam
        /<a href|<script/i, // HTML/JS injection attempts
        /test\d+|example\d+|sample\d+/i // Common test data
    ];

    for (const field of textFields) {
        if (req.body[field] && typeof req.body[field] === 'string') {
            for (const pattern of spamPatterns) {
                if (pattern.test(req.body[field])) {
                    return res.status(400).json({
                        success: false,
                        message: 'Invalid content detected'
                    });
                }
            }
        }
    }

    // Validate email format
    if (req.body.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(req.body.email)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email format'
            });
        }
    }

    // Validate phone format (basic check)
    if (req.body.phone) {
        const phoneRegex = /^[\d\s\+\-\(\)]{10,20}$/;
        if (!phoneRegex.test(req.body.phone)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid phone format'
            });
        }
    }

    // Check for excessive field lengths
    const maxLengths = {
        name: 100,
        email: 100,
        phone: 20,
        subject: 200,
        message: 2000,
        comment: 2000,
        requests: 500,
        notes: 500
    };

    for (const [field, maxLength] of Object.entries(maxLengths)) {
        if (req.body[field] && req.body[field].length > maxLength) {
            return res.status(400).json({
                success: false,
                message: `${field} exceeds maximum length`
            });
        }
    }

    next();
};

module.exports = spamProtection;
