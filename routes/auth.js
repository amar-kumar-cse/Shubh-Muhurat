const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { auth } = require('../validators');

// Public routes
router.post('/register', validate(auth.registerSchema), authController.register);
router.post('/login', validate(auth.loginSchema), authController.login);

// Protected routes
router.get('/me', protect, authController.getMe);
router.put('/password', protect, validate(auth.updatePasswordSchema), authController.updatePassword);

module.exports = router;
