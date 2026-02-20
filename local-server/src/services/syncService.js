const axios = require('axios');
const Student = require('../models/Student');
const District = require('../models/District');
const School = require('../models/School');
const User = require('../models/User');
const Attendance = require('../models/Attendance');
const Mark = require('../models/Mark');
const FileUpload = require('../models/FileUpload');

const { Op } = require('sequelize');

let authToken = null;

const getAuthToken = async () => {
    // ... existing logic
    if (authToken) return authToken;
    try {
        const response = await axios.post(`${process.env.CENTRAL_SERVER_URL}/auth/login`, {
            email: process.env.CENTRAL_EMAIL,
            password: process.env.CENTRAL_PASSWORD
        });
        authToken = response.data.token;
        return authToken;
    } catch (error) {
        console.error('Auth Error:', error.message);
        throw new Error('Failed to authenticate with Central Server');
    }
};

const pushData = async (Model, endpoint, payloadMapper) => {
    const token = await getAuthToken();
    const unsyncedItems = await Model.findAll({ where: { isSynced: false } });

    console.log(`Pushing ${unsyncedItems.length} items to ${endpoint}`);

    for (const item of unsyncedItems) {
        try {
            const payload = payloadMapper(item);
            const response = await axios.post(`${process.env.CENTRAL_SERVER_URL}/${endpoint}`, payload, {
                headers: { 'x-auth-token': token }
            });
            item.centralId = response.data._id;
            item.isSynced = true;
            await item.save();
        } catch (error) {
            console.error(`Failed to push item to ${endpoint}:`, error.message);
        }
    }
};

const pullData = async (Model, endpoint, uniqueField, mapper) => {
    const token = await getAuthToken();
    try {
        const response = await axios.get(`${process.env.CENTRAL_SERVER_URL}/${endpoint}`, {
            headers: { 'x-auth-token': token }
        });
        const centralItems = response.data;
        console.log(`Pulled ${centralItems.length} items from ${endpoint}`);

        for (const centralItem of centralItems) {
            const whereClause = { centralId: centralItem._id };
            // Use unique code/email if available for stricter matching on first sync
            // if (uniqueField && centralItem[uniqueField]) whereClause[uniqueField] = centralItem[uniqueField];

            const [localItem, created] = await Model.findOrCreate({
                where: whereClause,
                defaults: { ...mapper(centralItem), isSynced: true }
            });
            // Update logic if needed
        }
    } catch (error) {
        console.error(`Failed to pull from ${endpoint}:`, error.message);
    }
};

// Mappers
const studentMapper = (item) => ({
    schoolId: item.schoolId?._id || item.schoolId,
    name: item.name,
    rollNo: item.rollNo,
    class: item.class,
    section: item.section,
    guardianName: item.guardianName
});

// Teacher Mapper
const teacherMapper = (item) => ({
    userId: item.userId?._id || item.userId,
    schoolId: item.schoolId?._id || item.schoolId,
    name: item.name,
    subjects: item.subjects,
    classAdvisorOf: item.classAdvisorOf
});

const userMapper = (item) => ({
    centralId: item._id,
    name: item.name,
    email: item.email,
    passwordHash: item.passwordHash, // Caution: Syncing variable password hashes might be tricky if salts differ, but raw hash copy is usually ok.
    role: item.role,
    // Handle populated fields or direct IDs
    schoolId: item.schoolId?._id || item.schoolId,
    districtId: item.districtId?._id || item.districtId,
    teaches: item.teaches,
    classTeacherOf: item.classTeacherOf
});

const schoolMapper = (item) => ({
    code: item.code,
    name: item.name,
    districtId: item.districtId,
    address: item.address,
    blockId: item.blockId
});

const districtMapper = (item) => ({
    name: item.name,
    code: item.code,
    state: item.state
});

const attendanceMapper = (item) => ({
    date: item.date,
    schoolId: item.schoolId,
    class: item.class,
    section: item.section,
    totalStudents: item.totalStudents,
    presentStudentIds: item.presentStudentIds // Ensure parsing/stringifying JSON works
});

const markMapper = (item) => ({
    studentId: item.studentId,
    examType: item.examType,
    subject: item.subject,
    marksObtained: item.marksObtained,
    totalMarks: item.totalMarks,
    sourceDeviceId: item.sourceDeviceId
});


const syncAll = async () => {
    console.log('Starting Sync...');

    // Order matters for dependencies
    await pullData(District, 'districts', 'code', districtMapper); // Need endpoint
    await pullData(School, 'schools', 'code', schoolMapper);
    await pullData(User, 'users', 'email', userMapper);

    // Sync Teachers
    await pullData(Teacher, 'teachers', 'userId', teacherMapper); // Pull-only from central? Or bi-directional? Usually admins create teachers.

    await pushData(Student, 'students', studentMapper);
    await pullData(Student, 'students', null, studentMapper);

    await pushData(Attendance, 'attendance', attendanceMapper);
    await pullData(Attendance, 'attendance', null, attendanceMapper); // Only pull? Or bidirectional?

    await pushData(Mark, 'marks', markMapper);
    await pullData(Mark, 'marks', null, markMapper);

    console.log('Sync Complete.');
    return { success: true };
};

module.exports = { syncAll };
