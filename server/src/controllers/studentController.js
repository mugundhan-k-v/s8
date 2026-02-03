const Student = require('../models/Student');

// @desc    Get all students
// @route   GET /api/students
// @access  Private
exports.getStudents = async (req, res) => {
    try {
        const students = await Student.find().populate('schoolId', 'name');
        res.json(students);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Create a student
// @route   POST /api/students
// @access  Private
exports.createStudent = async (req, res) => {
    const { schoolId, name, rollNo, class: studentClass, section, guardianName } = req.body;

    try {
        const student = new Student({
            schoolId,
            name,
            rollNo,
            class: studentClass,
            section,
            guardianName,
        });

        await student.save();

        res.json(student);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
