const express = require('express');
const router = express.Router();
const { uploadFile, getFiles, downloadFile } = require('../controllers/contentController');

router.post('/', uploadFile);
router.get('/', getFiles);
router.get('/:id', downloadFile);

module.exports = router;
