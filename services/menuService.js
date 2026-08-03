const MenuItem = require('../models/MenuItem');
const { menuCategories, menuType } = require('../constants');
const { pick } = require('../utils');

const createFields = ['name', 'description', 'category', 'menuType', 'price', 'isVegetarian', 'isAvailable', 'image', 'preparationTime', 'servingSize', 'allergens', 'spiceLevel'];
const updateFields = [...createFields];

exports.getMenuItems = async (filters, pagination) => {
    const { page, limit, skip } = pagination;
    
    const menuItems = await MenuItem.find(filters)
        .sort({ category: 1, price: 1 })
        .skip(skip)
        .limit(limit);
    
    const total = await MenuItem.countDocuments(filters);
    
    return { menuItems, total };
};

exports.getMenuItemById = async (id) => {
    return await MenuItem.findById(id);
};

exports.createMenuItem = async (menuData) => {
    const menuItem = new MenuItem(pick(menuData, createFields));
    return await menuItem.save();
};

exports.updateMenuItem = async (id, updateData) => {
    return await MenuItem.findByIdAndUpdate(
        id,
        pick(updateData, updateFields),
        { new: true, runValidators: true }
    );
};

exports.deleteMenuItem = async (id) => {
    return await MenuItem.findByIdAndDelete(id);
};

exports.getCategories = async () => {
    return await MenuItem.distinct('category');
};

exports.buildMenuFilter = (query) => {
    const filter = {};
    
    if (query.category && menuCategories.ALL.includes(query.category)) {
        filter.category = query.category;
    }
    
    if (query.menuType && menuType.ALL.includes(query.menuType)) {
        filter.menuType = query.menuType;
    }
    
    if (query.isVegetarian !== undefined) {
        filter.isVegetarian = query.isVegetarian === 'true';
    }
    
    if (query.isAvailable !== undefined) {
        filter.isAvailable = query.isAvailable === 'true';
    }
    
    if (query.maxPrice) {
        const maxPrice = parseInt(query.maxPrice);
        if (!isNaN(maxPrice) && maxPrice > 0) {
            filter.price = { $lte: maxPrice };
        }
    }
    
    return filter;
};
