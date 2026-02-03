const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['SCHOOL', 'BLOCK', 'DISTRICT', 'STATE_ADMIN', 'TEACHER'],
        required: true,
    },
    schoolId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'School',
    },
    assignedClass: {
        type: String,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('User', userSchema);
