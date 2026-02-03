const mongoose = require('mongoose');

const markSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true,
    },
    examType: {
        type: String,
    },
    subject: {
        type: String,
    },
    marksObtained: {
        type: Number,
    },
    totalMarks: {
        type: Number,
    },
    sourceDeviceId: {
        type: String,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Mark', markSchema);
