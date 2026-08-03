const services = require('../services');
const { pagination } = require('../utils');

// Get all menu items with filtering
exports.getAllMenuItems = async (req, res, next) => {
    try {
        const { page, limit, skip } = pagination.getPagination(req.query);
        const { menuItems, total } = await services.menu.searchMenu(req.query, { page, limit, skip });
        const paginationMeta = pagination.buildPaginationMeta(total, page, limit);

        res.json({
            success: true,
            data: menuItems,
            pagination: paginationMeta
        });
    } catch (error) {
        next(error);
    }
};

// Upload menu image
exports.uploadMenuImage = async (req, res, next) => {
    try {
        if (!req.file || !req.file.path) {
            return res.status(400).json({
                success: false,
                message: 'Image file is required'
            });
        }

        const menuItem = await services.menu.updateMenuItem(req.params.id, { image: req.file.path });

        if (!menuItem) {
            return res.status(404).json({
                success: false,
                message: 'Menu item not found'
            });
        }

        res.json({
            success: true,
            message: 'Menu image uploaded successfully',
            data: menuItem
        });
    } catch (error) {
        next(error);
    }
};

// Get single menu item by ID
exports.getMenuItemById = async (req, res, next) => {
    try {
        const menuItem = await services.menu.getMenuItemById(req.params.id);

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
        const newMenuItem = await services.menu.createMenuItem(req.body);

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
        const menuItem = await services.menu.updateMenuItem(req.params.id, req.body);

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
        const menuItem = await services.menu.deleteMenuItem(req.params.id);

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
        const categories = await services.menu.getCategories();
        res.json({
            success: true,
            data: categories
        });
    } catch (error) {
        next(error);
    }
};
