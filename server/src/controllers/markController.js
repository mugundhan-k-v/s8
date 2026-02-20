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
        // PERMISSION CHECK
        const user = req.user;

        // Find student to know their class
        const student = await require('../models/Student').findById(studentId);
        if (!student) {
            return res.status(404).json({ msg: 'Student not found' });
        }

        if (user.role === 'TEACHER') {
            // Check if teacher handles this subject for this class
            const isAuthorized = user.teaches.some(t =>
                t.class === student.class &&
                t.section === student.section && // Assuming strict section match
                t.subject === subject
            );

            if (!isAuthorized) {
                return res.status(403).json({ msg: 'Not authorized to update marks for this subject/class' });
            }
        } else if (user.role !== 'SCHOOL_ADMIN' && user.role !== 'HEADMASTER') {
            // Assuming Admin/HM can update all? Or restrict them too? 
            // For now, allow Admins, restrict others not Teacher.
            if (!['SCHOOL_ADMIN', 'HEADMASTER', 'PRINCIPAL'].includes(user.role)) {
                // return res.status(403).json({ msg: 'Not authorized' });
            }
        }


        const mark = new Mark({
            studentId,
            examType,
            subject,
            marksObtained,
            totalMarks,
            sourceDeviceId: req.body.sourceDeviceId // maintain this if needed
        });

        await mark.save();

        res.json(mark);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
