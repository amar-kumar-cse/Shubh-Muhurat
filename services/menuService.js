const mongoose = require('mongoose');
const MenuItem = require('../models/MenuItem');
const { menuCategories, menuType } = require('../constants');
const { pick } = require('../utils');

const createFields = ['name', 'description', 'category', 'menuType', 'price', 'isVegetarian', 'isAvailable', 'image', 'preparationTime', 'servingSize', 'allergens', 'spiceLevel'];
const updateFields = [...createFields];

exports.getMenuItems = async (filters, pagination) => {
    const { page, limit, skip } = pagination;

    if (mongoose.connection.readyState !== 1) {
        return { menuItems: [], total: 0 };
    }
    
    const menuItems = await MenuItem.find(filters)
        .sort({ category: 1, price: 1 })
        .skip(skip)
        .limit(limit);
    
    const total = await MenuItem.countDocuments(filters);
    
    return { menuItems, total };
};

exports.getMenuItemById = async (id) => {
    if (mongoose.connection.readyState !== 1) {
        return null;
    }

    return await MenuItem.findById(id);
};

exports.searchMenu = async (query, pagination) => {
    const filter = exports.buildMenuFilter(query);

    if (query.search) {
        filter.$or = [
            { name: { $regex: query.search.trim(), $options: 'i' } },
            { description: { $regex: query.search.trim(), $options: 'i' } },
            { category: { $regex: query.search.trim(), $options: 'i' } },
            { menuType: { $regex: query.search.trim(), $options: 'i' } }
        ];
    }

    return exports.getMenuItems(filter, pagination);
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
    if (mongoose.connection.readyState !== 1) {
        return [];
    }

    return await MenuItem.distinct('category');
};

exports.buildMenuFilter = (query) => {
    const filter = {};
    
    if (query.category && query.category !== 'All') {
        filter.category = new RegExp(`^${query.category.trim()}$`, 'i');
    }
    
    if (query.eventType) {
        const et = query.eventType.trim();
        const base = et.replace(/ Menu$/i, '');
        filter.$or = [
            { menuType: new RegExp(`^${base}`, 'i') },
            { menuType: new RegExp(et, 'i') }
        ];
    } else if (query.menuType) {
        const mt = query.menuType.trim();
        const base = mt.replace(/ Menu$/i, '');
        filter.$or = [
            { menuType: new RegExp(`^${base}`, 'i') },
            { menuType: new RegExp(mt, 'i') }
        ];
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
