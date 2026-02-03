const express = require('express');
const router = express.Router();
const { getMarks, addMarks } = require('../controllers/markController');

router.get('/', getMarks);
router.post('/', addMarks);

module.exports = router;
