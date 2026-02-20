const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Teacher = sequelize.define('Teacher', {
    _id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    centralId: {
        type: DataTypes.STRING,
        unique: true
    },
    userId: {
        type: DataTypes.STRING, // Storing Central User ID
        allowNull: false
    },
    schoolId: {
        type: DataTypes.STRING, // Storing Central School ID (or local FK if we link)
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    subjects: {
        type: DataTypes.JSON, // Storing array of objects as JSON
        defaultValue: []
    },
    classAdvisorOf: {
        type: DataTypes.JSON, // Storing object as JSON
        allowNull: true
    },
    isSynced: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
});

module.exports = Teacher;
