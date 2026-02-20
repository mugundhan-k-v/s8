const express = require('express');
const router = express.Router();
const { getMarks, addMark } = require('../controllers/markController');

router.get('/', getMarks);
router.post('/', addMark);

module.exports = router;
