const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { getStudents, createStudent } = require('../controllers/studentController');

router.get('/', auth, getStudents);
router.post('/', auth, createStudent);

module.exports = router;
