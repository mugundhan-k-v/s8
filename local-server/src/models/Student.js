const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Student = sequelize.define('Student', {
    _id: { // Keeping _id to match MongoDB ObjectId if possible, or mapping it. 
        // Actually better to use a standard ID and maybe a separate field for mongoId if needed.
        // For simplicity in sync, let's use a UUID or string as primary key to avoid collisions? 
        // Or just let SQLite auto-increment and keeping a 'centralId' field.
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    centralId: { // ID in the central MongoDB
        type: DataTypes.STRING,
        allowNull: true
    },
    schoolId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    rollNo: {
        type: DataTypes.STRING
    },
    class: {
        type: DataTypes.STRING,
        allowNull: false
    },
    section: {
        type: DataTypes.STRING
    },
    guardianName: {
        type: DataTypes.STRING
    },
    assignedTeacherId: {
        type: DataTypes.STRING
    },
    isSynced: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    timestamps: true
});

module.exports = Student;
