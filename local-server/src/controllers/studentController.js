const Student = require('../models/Student');
const axios = require('axios');

// Get all students
exports.getStudents = async (req, res) => {
    try {
        const students = await Student.findAll();
        res.json(students);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// Create a student
exports.createStudent = async (req, res) => {
    const { schoolId, name, rollNo, class: studentClass, section, guardianName } = req.body;

    try {
        const student = await Student.create({
            schoolId,
            name,
            rollNo,
            class: studentClass,
            section,
            guardianName,
            isSynced: false // Create as unsynced
        });

        res.json(student);

        // Optional: Trigger background sync immediately
        // syncStudentToCentral(student); 
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};
