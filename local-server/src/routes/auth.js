const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { login, getMe } = require('../controllers/authController');

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', login);

// @route   GET /api/auth
// @desc    Get logged in user
// @access  Private
router.get('/', auth, getMe);

module.exports = router;
