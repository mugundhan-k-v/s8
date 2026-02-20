require('dotenv').config();
const mongoose = require('mongoose');
const School = require('./src/models/School');
const User = require('./src/models/User');
const Student = require('./src/models/Student');
const District = require('./src/models/District');
const Teacher = require('./src/models/Teacher');
const connectDB = require('./src/config/db');
const bcrypt = require('bcryptjs');

const seedData = async () => {
    await connectDB();

    try {
        console.log('Clearing old data...');
        await District.deleteMany({});
        await School.deleteMany({});
        await User.deleteMany({});
        await Student.deleteMany({});
        await Teacher.deleteMany({});

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash('password123', salt);

        // --- State Admin ---
        await User.create({
            name: 'State Admin',
            email: 'state@admin.com',
            passwordHash,
            role: 'STATE_ADMIN',
        });
        console.log('State Admin Created');

        // --- Helper to create Teacher User & Profile ---
        const createTeacher = async (name, email, schoolId, subjects = [], advisorOf = null) => {
            const user = await User.create({
                name,
                email,
                passwordHash,
                role: 'TEACHER',
                schoolId
            });
            await Teacher.create({
                userId: user._id,
                schoolId,
                name,
                subjects,
                classAdvisorOf: advisorOf
            });
            return user;
        };

        // --- Function to Seed a District with 2 Schools ---
        const seedDistrict = async (distName, distCode, state) => {
            const district = await District.create({ name: distName, code: distCode, state });

            // School 1
            await seedSchool(district, 1);
            // School 2
            await seedSchool(district, 2);
        };

        const seedSchool = async (district, num) => {
            const schoolCode = `${district.code}_SCH_0${num}`;
            const schoolName = `${district.name} School ${num}`;

            const school = await School.create({
                code: schoolCode,
                name: schoolName,
                address: `${district.name} Area ${num}`,
                districtId: district._id
            });

            // School Admin
            await User.create({
                name: `${schoolName} Admin`,
                email: `admin_${schoolCode.toLowerCase()}@school.com`,
                passwordHash,
                role: 'SCHOOL_ADMIN',
                schoolId: school._id,
                districtId: district._id
            });

            // --- Subject Teachers ---
            // Physics
            await createTeacher(`${schoolName} Physics Staff`, `physics_${schoolCode.toLowerCase()}@school.com`, school._id,
                [{ subject: 'Physics', class: '10', section: 'A' }, { subject: 'Physics', class: '12', section: 'A' }]);

            // Chemistry
            await createTeacher(`${schoolName} Chemistry Staff`, `chem_${schoolCode.toLowerCase()}@school.com`, school._id,
                [{ subject: 'Chemistry', class: '10', section: 'A' }, { subject: 'Chemistry', class: '12', section: 'A' }]);

            // Bio-Maths
            await createTeacher(`${schoolName} BioMaths Staff`, `maths_${schoolCode.toLowerCase()}@school.com`, school._id,
                [{ subject: 'Bio-Maths', class: '10', section: 'A' }, { subject: 'Bio-Maths', class: '12', section: 'A' }]);

            // Social Science
            await createTeacher(`${schoolName} Social Staff`, `social_${schoolCode.toLowerCase()}@school.com`, school._id,
                [{ subject: 'Social Science', class: '10', section: 'A' }]);

            // English (Also Class Advisor 10-A)
            await createTeacher(`${schoolName} English Staff`, `english_${schoolCode.toLowerCase()}@school.com`, school._id,
                [{ subject: 'English', class: '10', section: 'A' }, { subject: 'English', class: '12', section: 'A' }],
                { class: '10', section: 'A' });

            // Tamil (Also Class Advisor 12-A)
            await createTeacher(`${schoolName} Tamil Staff`, `tamil_${schoolCode.toLowerCase()}@school.com`, school._id,
                [{ subject: 'Tamil', class: '10', section: 'A' }, { subject: 'Tamil', class: '12', section: 'A' }],
                { class: '12', section: 'A' });

            // --- Students ---
            await Student.create({ name: 'Student 10-A-1', rollNo: '1001', class: '10', section: 'A', schoolId: school._id });
            await Student.create({ name: 'Student 12-A-1', rollNo: '1201', class: '12', section: 'A', schoolId: school._id });
        };

        // --- Execute Seeding ---
        await seedDistrict('Chennai', 'DST_CHN', 'Tamil Nadu');
        await seedDistrict('Coimbatore', 'DST_CBE', 'Tamil Nadu');

        console.log('Database Seeded: 2 Districts, 4 Schools, All Subject Teachers, Students.');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedData();
