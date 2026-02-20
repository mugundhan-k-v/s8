const express = require('express');
const router = express.Router();
// Placeholder: need to implement controller logic for uploads if needed locally
// For now, just return empty array to prevent 404
router.get('/', (req, res) => res.json([]));
router.post('/', (req, res) => res.json({ msg: 'Upload unimplemented locally' }));

module.exports = router;
