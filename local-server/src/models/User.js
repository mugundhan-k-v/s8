const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
    _id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    centralId: {
        type: DataTypes.STRING,
        allowNull: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    passwordHash: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('STATE_ADMIN', 'DISTRICT_ADMIN', 'SCHOOL_ADMIN', 'TEACHER'),
        allowNull: false
    },
    districtId: {
        type: DataTypes.STRING,
        allowNull: true
    },
    schoolId: {
        type: DataTypes.STRING,
        allowNull: true
    },
    // Storing objects/arrays as JSON strings in SQLite
    classTeacherOf: {
        type: DataTypes.JSON,
        allowNull: true
    },
    teaches: {
        type: DataTypes.JSON,
        allowNull: true
    },
    isSynced: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    timestamps: true
});

module.exports = User;
