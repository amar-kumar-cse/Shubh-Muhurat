const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const { protect, authorize } = require('../middleware/auth');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
	cloudinary,
	params: async () => ({
		folder: 'shubh-muhurat/menu',
		allowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
		transformation: [{ quality: 'auto', fetch_format: 'auto' }]
	})
});

const upload = multer({ storage });

// Menu routes
router.get('/', menuController.getAllMenuItems);
router.get('/search', menuController.getAllMenuItems);
router.get('/categories', menuController.getCategories);
router.post('/:id/image', protect, authorize('admin', 'staff'), upload.single('image'), menuController.uploadMenuImage);
router.get('/:id', menuController.getMenuItemById);
router.post('/', protect, authorize('admin', 'staff'), menuController.createMenuItem);
router.put('/:id', protect, authorize('admin', 'staff'), menuController.updateMenuItem);
router.delete('/:id', protect, authorize('admin'), menuController.deleteMenuItem);

module.exports = router;
