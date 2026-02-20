const School = require('../models/School');

exports.getSchools = async (req, res) => {
    try {
        const schools = await School.findAll();
        res.json(schools);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
