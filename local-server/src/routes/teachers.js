const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware'); // Optional: Protect routes
const { getTeachers, createTeacher } = require('../controllers/teacherController');

router.get('/', getTeachers);
router.post('/', createTeacher); // Ideally protected

module.exports = router;
