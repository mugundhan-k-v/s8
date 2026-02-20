const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { getDistricts, createDistrict } = require('../controllers/districtController');

// Public access to list districts? Or authenticated? 
// For sync, we use auth token. But maybe Login page needs list of districts without token?
// Let's protect create, allow read.
router.get('/', getDistricts);
router.post('/', auth, createDistrict);

module.exports = router;
