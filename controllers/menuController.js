const MenuItem = require('../models/MenuItem');

// Get all menu items with filtering
exports.getAllMenuItems = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = Math.min(parseInt(req.query.limit) || 50, 100);
        const skip = (page - 1) * limit;

        // Build filter object - sanitize to prevent NoSQL injection
        const filter = {};
        const allowedCategories = ['Starters', 'Main Course', 'Desserts', 'Beverages', 'Snacks', 'Special Items'];
        if (req.query.category && allowedCategories.includes(req.query.category)) {
            filter.category = req.query.category;
        }
        const allowedMenuTypes = ['Veg', 'Non-Veg', 'Both'];
        if (req.query.menuType && allowedMenuTypes.includes(req.query.menuType)) {
            filter.menuType = req.query.menuType;
        }
        if (req.query.isVegetarian !== undefined) filter.isVegetarian = req.query.isVegetarian === 'true';
        if (req.query.isAvailable !== undefined) filter.isAvailable = req.query.isAvailable === 'true';
        if (req.query.maxPrice) {
            const maxPrice = parseInt(req.query.maxPrice);
            if (!isNaN(maxPrice) && maxPrice > 0) filter.price = { $lte: maxPrice };
        }

        const menuItems = await MenuItem.find(filter)
            .sort({ category: 1, price: 1 })
            .skip(skip)
            .limit(limit);

        const total = await MenuItem.countDocuments(filter);

        res.json({
            success: true,
            data: menuItems,
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

// Get single menu item by ID
exports.getMenuItemById = async (req, res, next) => {
    try {
        const menuItem = await MenuItem.findById(req.params.id);

        if (!menuItem) {
            return res.status(404).json({
                success: false,
                message: 'Menu item not found'
            });
        }

        res.json({
            success: true,
            data: menuItem
        });
    } catch (error) {
        next(error);
    }
};

// Create new menu item
exports.createMenuItem = async (req, res, next) => {
    try {
        const newMenuItem = new MenuItem(req.body);
        await newMenuItem.save();

        res.status(201).json({
            success: true,
            message: 'Menu item created successfully!',
            data: newMenuItem
        });
    } catch (error) {
        next(error);
    }
};

// Update menu item by ID
exports.updateMenuItem = async (req, res, next) => {
    try {
        const menuItem = await MenuItem.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!menuItem) {
            return res.status(404).json({
                success: false,
                message: 'Menu item not found'
            });
        }

        res.json({
            success: true,
            message: 'Menu item updated successfully',
            data: menuItem
        });
    } catch (error) {
        next(error);
    }
};

// Delete menu item by ID
exports.deleteMenuItem = async (req, res, next) => {
    try {
        const menuItem = await MenuItem.findByIdAndDelete(req.params.id);

        if (!menuItem) {
            return res.status(404).json({
                success: false,
                message: 'Menu item not found'
            });
        }

        res.json({
            success: true,
            message: 'Menu item deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

// Get menu categories
exports.getCategories = async (req, res, next) => {
    try {
        const categories = await MenuItem.distinct('category');
        res.json({
            success: true,
            data: categories
        });
    } catch (error) {
        next(error);
    }
};
