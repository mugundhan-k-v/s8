const Teacher = require('../models/Teacher');
const User = require('../models/User');

exports.getTeachers = async (req, res) => {
    try {
        const teachers = await Teacher.findAll();
        res.json(teachers);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.createTeacher = async (req, res) => {
    // Basic implementation for local creation (offline mode)
    // Note: ID generation and syncing considerations apply
    try {
        const teacher = await Teacher.create(req.body);
        res.json(teacher);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
