const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Mark = sequelize.define('Mark', {
    _id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    centralId: {
        type: DataTypes.STRING,
        allowNull: true
    },
    studentId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    examType: {
        type: DataTypes.STRING,
        allowNull: true
    },
    subject: {
        type: DataTypes.STRING,
        allowNull: true
    },
    marksObtained: {
        type: DataTypes.FLOAT, // Use FLOAT for flexibility
        allowNull: true
    },
    totalMarks: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    sourceDeviceId: {
        type: DataTypes.STRING,
        allowNull: true
    },
    isSynced: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    timestamps: true
});

module.exports = Mark;
