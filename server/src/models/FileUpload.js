const mongoose = require('mongoose');

const fileUploadSchema = new mongoose.Schema({
    schoolId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'School',
        required: true,
    },
    fileName: {
        type: String,
        required: true,
    },
    fileData: {
        type: Buffer,
        required: true,
    },
    fileSizeBytes: {
        type: Number,
    },
    fileType: {
        type: String,
    },
    uploadStatus: {
        type: String,
        default: 'COMPLETED',
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('FileUpload', fileUploadSchema);
