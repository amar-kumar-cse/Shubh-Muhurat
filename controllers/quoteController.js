const services = require('../services');

exports.createQuote = async (req, res, next) => {
    try {
        const quote = await services.quote.createQuote(req.body);

        res.status(201).json({
            success: true,
            message: 'Quote created successfully',
            data: quote
        });
    } catch (error) {
        next(error);
    }
};

exports.calculateQuote = async (req, res, next) => {
    try {
        const quote = await services.quote.calculateQuote(req.body);

        res.json({
            success: true,
            data: quote
        });
    } catch (error) {
        next(error);
    }
};

exports.getQuoteByBookingId = async (req, res, next) => {
    try {
        const quote = await services.quote.getQuoteByBookingId(req.params.bookingId);

        if (!quote) {
            return res.status(404).json({ success: false, message: 'Quote not found' });
        }

        res.json({ success: true, data: quote });
    } catch (error) {
        next(error);
    }
};