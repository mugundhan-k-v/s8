const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { getTeachers, createTeacher } = require('../controllers/teacherController');

router.get('/', getTeachers);
router.post('/', auth, createTeacher);

module.exports = router;
