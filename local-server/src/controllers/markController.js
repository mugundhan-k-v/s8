const Mark = require('../models/Mark');

exports.getMarks = async (req, res) => {
    try {
        const marks = await Mark.findAll();
        res.json(marks);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.addMark = async (req, res) => {
    try {
        const mark = await Mark.create(req.body);
        res.json(mark);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
