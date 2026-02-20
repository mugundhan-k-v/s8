const { Sequelize } = require('sequelize');
const path = require('path');

// When bundled in Electron, DB_PATH is set to the user's AppData folder
// so data persists across app updates. Falls back to local path in dev.
const dbPath = process.env.DB_PATH || path.join(__dirname, '../../database.sqlite');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: dbPath,
    logging: false
});

module.exports = sequelize;
