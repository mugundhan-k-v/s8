const School = require('../models/School');

// @desc    Get all schools
// @route   GET /api/schools
// @access  Private
exports.getSchools = async (req, res) => {
    try {
        const schools = await School.find();
        res.json(schools);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Create a school
// @route   POST /api/schools
// @access  Private
exports.createSchool = async (req, res) => {
    const { code, name, address } = req.body;

    try {
        let school = await School.findOne({ code });

        if (school) {
            return res.status(400).json({ msg: 'School already exists' });
        }

        school = new School({
            code,
            name,
            address,
        });

        await school.save();

        res.json(school);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
