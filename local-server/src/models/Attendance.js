const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Attendance = sequelize.define('Attendance', {
    _id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    centralId: {
        type: DataTypes.STRING,
        allowNull: true
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    schoolId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    class: {
        type: DataTypes.STRING,
        allowNull: false
    },
    section: {
        type: DataTypes.STRING,
        allowNull: true
    },
    totalStudents: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    presentStudentIds: {
        type: DataTypes.JSON, // Array of student IDs
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

module.exports = Attendance;
