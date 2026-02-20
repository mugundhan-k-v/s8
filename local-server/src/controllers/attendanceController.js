const Attendance = require('../models/Attendance');

exports.getAttendance = async (req, res) => {
    try {
        const attendance = await Attendance.findAll();
        res.json(attendance);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.markAttendance = async (req, res) => {
    try {
        const attendance = await Attendance.create(req.body);
        res.json(attendance);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
