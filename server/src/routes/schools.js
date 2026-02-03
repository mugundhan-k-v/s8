const express = require('express');
const router = express.Router();
const { getSchools, createSchool } = require('../controllers/schoolController');

router.get('/', getSchools);
router.post('/', createSchool);

module.exports = router;
