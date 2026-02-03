const mongoose = require('mongoose');

const schoolSchema = new mongoose.Schema({
    code: {
        type: String, // UDISE Code
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    blockId: {
        type: mongoose.Schema.Types.ObjectId,
        // ref: 'Block' // If Block model exists
    },
    districtId: {
        type: mongoose.Schema.Types.ObjectId,
        // ref: 'District' // If District model exists
    },
    address: {
        type: String,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('School', schoolSchema);
