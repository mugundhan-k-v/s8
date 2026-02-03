const Mark = require('../models/Mark');

// @desc    Get marks
// @route   GET /api/marks
// @access  Private
exports.getMarks = async (req, res) => {
    try {
        const marks = await Mark.find().populate('studentId', 'name');
        res.json(marks);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Add marks
// @route   POST /api/marks
// @access  Private
exports.addMarks = async (req, res) => {
    const { studentId, examType, subject, marksObtained, totalMarks } = req.body;

    try {
        const mark = new Mark({
            studentId,
            examType,
            subject,
            marksObtained,
            totalMarks,
        });

        await mark.save();

        res.json(mark);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
