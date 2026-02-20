const District = require('../models/District');

exports.getDistricts = async (req, res) => {
    try {
        const districts = await District.findAll();
        res.json(districts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
