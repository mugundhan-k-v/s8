const Attendance = require('../models/Attendance');

// @desc    Get attendance records
// @route   GET /api/attendance
// @access  Private
exports.getAttendance = async (req, res) => {
    try {
        const attendance = await Attendance.find().populate('schoolId', 'name');
        res.json(attendance);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Record attendance
// @route   POST /api/attendance
// @access  Private
exports.recordAttendance = async (req, res) => {
    const { date, schoolId, class: className, section, totalStudents, presentStudentIds } = req.body;

    try {
        const attendance = new Attendance({
            date,
            schoolId,
            class: className,
            section,
            totalStudents,
            presentStudentIds,
        });

        await attendance.save();

        res.json(attendance);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
