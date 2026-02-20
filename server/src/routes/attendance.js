const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { getAttendance, recordAttendance } = require('../controllers/attendanceController');

router.get('/', auth, getAttendance);
router.post('/', auth, recordAttendance);

module.exports = router;
