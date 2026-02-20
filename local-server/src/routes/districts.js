const express = require('express');
const router = express.Router();
const { getDistricts } = require('../controllers/districtController');

router.get('/', getDistricts);

module.exports = router;
