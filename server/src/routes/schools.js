const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { getSchools, createSchool } = require('../controllers/schoolController');

router.get('/', auth, getSchools);
router.post('/', auth, createSchool);

module.exports = router;
