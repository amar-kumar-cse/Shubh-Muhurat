let sanitizeHtml;
try {
    sanitizeHtml = require('sanitize-html');
} catch (err) {
    // Fallback sanitizer for environments where sub-dependencies are ESM
    sanitizeHtml = (dirty) => {
        if (!dirty || typeof dirty !== 'string') return dirty;
        return dirty
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .replace(/<[^>]+>/g, '')
            .trim();
    };
}

const sanitizeValue = (value) => {
    if (typeof value === 'string') {
        return sanitizeHtml(value, {
            allowedTags: [], // Strip all HTML tags
            allowedAttributes: {},
            disallowedTagsMode: 'discard'
        }).trim();
    }
    if (Array.isArray(value)) {
        return value.map(sanitizeValue);
    }
    if (value !== null && typeof value === 'object') {
        return sanitizeObject(value);
    }
    return value;
};

const sanitizeObject = (obj) => {
    const sanitized = {};
    for (const key of Object.keys(obj)) {
        sanitized[key] = sanitizeValue(obj[key]);
    }
    return sanitized;
};

const sanitizeXSS = (req, res, next) => {
    if (req.body && typeof req.body === 'object') {
        req.body = sanitizeObject(req.body);
    }
    if (req.query && typeof req.query === 'object') {
        req.query = sanitizeObject(req.query);
    }
    if (req.params && typeof req.params === 'object') {
        req.params = sanitizeObject(req.params);
    }
    next();
};

module.exports = { sanitizeXSS, sanitizeValue };
