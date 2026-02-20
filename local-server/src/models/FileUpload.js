const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const FileUpload = sequelize.define('FileUpload', {
    _id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    centralId: {
        type: DataTypes.STRING,
        allowNull: true
    },
    schoolId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    fileName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    fileData: {
        type: DataTypes.BLOB, // Storing file data in SQLite BLOB
        allowNull: true // Optional if storing path instead, but schema says Buffer
    },
    fileSizeBytes: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    fileType: {
        type: DataTypes.STRING,
        allowNull: true
    },
    uploadStatus: {
        type: DataTypes.STRING,
        defaultValue: 'COMPLETED'
    },
    isSynced: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    timestamps: true
});

module.exports = FileUpload;
