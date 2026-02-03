const express = require('express');
const router = express.Router();
const { getAttendance, recordAttendance } = require('../controllers/attendanceController');

router.get('/', getAttendance);
router.post('/', recordAttendance);

module.exports = router;
