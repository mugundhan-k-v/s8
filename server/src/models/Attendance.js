const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
    },
    schoolId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'School',
        required: true,
    },
    class: {
        type: String,
        required: true,
    },
    section: {
        type: String,
    },
    totalStudents: {
        type: Number,
    },
    presentStudentIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
    }],
    sourceDeviceId: {
        type: String,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Attendance', attendanceSchema);
