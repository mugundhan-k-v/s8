require('dotenv').config();
const mongoose = require('mongoose');
const School = require('./src/models/School');
const User = require('./src/models/User');
const Student = require('./src/models/Student');
const connectDB = require('./src/config/db');

const bcrypt = require('bcryptjs');

const seedData = async () => {
    await connectDB();

    try {
        // Clear existing data
        await School.deleteMany({});
        await User.deleteMany({});
        await Student.deleteMany({});

        console.log('Data Cleared');

        // Create School
        const school = await School.create({
            code: 'SCH001',
            name: 'Gangtok Senior Secondary School',
            address: 'Gangtok, Sikkim',
        });
        console.log(`School Created: ${school.name}`);

        // Create Teacher
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash('password123', salt);

        await User.create([
            {
                name: 'Mr. Pradhan',
                email: 'pradhan@school.com',
                passwordHash,
                role: 'TEACHER',
                schoolId: school._id,
                assignedClass: '10-A',
            },
            {
                name: 'School Admin',
                email: 'admin@school.com',
                passwordHash,
                role: 'SCHOOL',
                schoolId: school._id,
            },
            {
                name: 'Block Officer',
                email: 'block@sikkim.gov.in',
                passwordHash,
                role: 'BLOCK',
            },
            {
                name: 'District Officer',
                email: 'district@sikkim.gov.in',
                passwordHash,
                role: 'DISTRICT',
            },
            {
                name: 'State Admin',
                email: 'state@sikkim.gov.in',
                passwordHash,
                role: 'STATE_ADMIN',
            }
        ]);
        console.log('Users for all categories created');

        // Create Students
        const students = await Student.create([
            {
                schoolId: school._id,
                name: 'Rohan Sharma',
                rollNo: '01',
                class: '10-A',
                guardianName: 'Suresh Sharma',
            },
            {
                schoolId: school._id,
                name: 'Aditi Rao',
                rollNo: '02',
                class: '10-A',
                guardianName: 'Rajesh Rao',
            },
            {
                schoolId: school._id,
                name: 'Pemba Sherpa',
                rollNo: '03',
                class: '10-A',
                guardianName: 'Dorjee Sherpa',
            },
        ]);

        console.log(`${students.length} Students Created`);

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedData();
