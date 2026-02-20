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
        // PERMISSION CHECK
        const user = req.user;

        if (user.role === 'TEACHER') {
            // Check if user is Class Teacher of this class
            if (!user.classTeacherOf ||
                user.classTeacherOf.class !== className ||
                user.classTeacherOf.section !== section) {
                return res.status(403).json({ msg: 'Not authorized. You are not the Class Teacher for this class.' });
            }
        }

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
