const express = require('express');
const router = express.Router();
const { syncAll } = require('../services/syncService');

router.post('/', async (req, res) => {
    try {
        const result = await syncAll();
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
