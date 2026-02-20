const District = require('../models/District');

// @desc    Get all districts
// @route   GET /api/districts
// @access  Public
exports.getDistricts = async (req, res) => {
    try {
        const districts = await District.find();
        res.json(districts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Create a district
// @route   POST /api/districts
// @access  Private
exports.createDistrict = async (req, res) => {
    const { name, code, state } = req.body;

    try {
        let district = await District.findOne({ code });
        if (district) {
            return res.status(400).json({ msg: 'District already exists' });
        }

        district = new District({
            name,
            code,
            state
        });

        await district.save();

        res.json(district);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
