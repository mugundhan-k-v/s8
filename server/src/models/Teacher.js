const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    schoolId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'School',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    subjects: [{
        subject: String,
        class: String,
        section: String
    }],
    classAdvisorOf: {
        class: String,
        section: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Teacher', teacherSchema);
