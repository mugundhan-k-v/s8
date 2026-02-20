const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./config/database');
const Student = require('./models/Student');
const District = require('./models/District');
const School = require('./models/School');
const User = require('./models/User');
const Attendance = require('./models/Attendance');
const Mark = require('./models/Mark');
const Teacher = require('./models/Teacher');
const FileUpload = require('./models/FileUpload');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic Route
app.get('/', (req, res) => {
    res.send('Local Server is running...');
});

// Import Routes (to be created)
app.use('/api/sync', require('./routes/sync'));
app.use('/api/students', require('./routes/students'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/teachers', require('./routes/teachers'));
app.use('/api/schools', require('./routes/schools'));
app.use('/api/districts', require('./routes/districts'));
app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/marks', require('./routes/marks'));
app.use('/api/upload', require('./routes/upload'));

// Sync Database and Start Server
sequelize.sync().then(() => {
    console.log('Local SQLite Database Synced');
    app.listen(PORT, () => {
        console.log(`Local Server running on port ${PORT}`);
    });
}).catch(err => {
    console.error('Failed to sync database:', err);
});
