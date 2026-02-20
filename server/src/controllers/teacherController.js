const Teacher = require('../models/Teacher');

// @desc    Get all teachers
// @route   GET /api/teachers
// @access  Public (or Protected)
exports.getTeachers = async (req, res) => {
    try {
        const teachers = await Teacher.find().populate('userId', 'email role');
        res.json(teachers);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Create a teacher
// @route   POST /api/teachers
// @access  Private
exports.createTeacher = async (req, res) => {
    const { userId, schoolId, name, subjects, classAdvisorOf } = req.body;

    try {
        let teacher = await Teacher.findOne({ userId });
        if (teacher) {
            return res.status(400).json({ msg: 'Teacher profile already exists for this user' });
        }

        teacher = new Teacher({
            userId,
            schoolId,
            name,
            subjects,
            classAdvisorOf
        });

        await teacher.save();
        res.json(teacher);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
