const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    schoolId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'School',
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    rollNo: {
        type: String,
    },
    class: {
        type: String,
        required: true,
    },
    section: {
        type: String,
    },
    guardianName: {
        type: String,
    },
    assignedTeacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Student', studentSchema);
