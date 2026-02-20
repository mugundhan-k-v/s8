const mongoose = require('mongoose');

const districtSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    code: {
        type: String,
        required: true,
        unique: true,
    },
    state: {
        type: String,
        required: true,
        default: 'Tamil Nadu' // Defaulting for now as per likely requirement, or can be generic
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('District', districtSchema);
