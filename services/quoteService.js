const Quote = require('../models/Quote');
const MenuItem = require('../models/MenuItem');

const calculateEstimatedTotal = async (selectedItems = [], guestCount = 1) => {
    const itemIds = selectedItems.map((item) => item.menuItem);
    const menuItems = await MenuItem.find({ _id: { $in: itemIds } }).select('price');
    const priceMap = new Map(menuItems.map((item) => [String(item._id), item.price]));

    return selectedItems.reduce((total, item) => {
        const itemPrice = priceMap.get(String(item.menuItem)) || 0;
        return total + (itemPrice * (item.quantity || 1));
    }, guestCount * 50);
};

exports.createQuote = async (quoteData) => {
    const estimatedTotal = await calculateEstimatedTotal(quoteData.selectedItems, quoteData.guestCount);
    const quote = new Quote({
        ...quoteData,
        estimatedTotal
    });

    return quote.save();
};

exports.calculateQuote = async (quoteData) => {
    const estimatedTotal = await calculateEstimatedTotal(quoteData.selectedItems, quoteData.guestCount);

    return {
        guestCount: quoteData.guestCount,
        estimatedTotal,
        selectedItems: quoteData.selectedItems || []
    };
};

exports.getQuoteByBookingId = async (bookingId) => {
    return Quote.findOne({ bookingId }).populate('selectedItems.menuItem').populate('bookingId');
};