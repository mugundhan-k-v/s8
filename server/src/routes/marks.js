const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { getMarks, addMarks } = require('../controllers/markController');

router.get('/', auth, getMarks);
router.post('/', auth, addMarks);

module.exports = router;
