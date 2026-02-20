const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const db = new sqlite3.Database('database.sqlite');

const seedLocalQuery = async () => {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('password123', salt);

    const user = {
        _id: uuidv4(),
        name: 'Chennai School Admin',
        email: 'admin_dst_chn_sch_01@school.com',
        passwordHash: passwordHash,
        role: 'SCHOOL_ADMIN',
        schoolId: 'DST_CHN_SCH_01', // Simulation ID
        isSynced: true
    };

    // Create Tables if not exist (just in case) - usually handled by Sequelize but for raw seed:
    // We assume Sequelize already created tables via start up.

    db.serialize(() => {
        const stmt = db.prepare("INSERT INTO Users (_id, name, email, passwordHash, role, schoolId, isSynced, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))");
        stmt.run(user._id, user.name, user.email, user.passwordHash, user.role, user.schoolId, 1, (err) => {
            if (err) {
                console.log('Error inserting user (might exist):', err.message);
            } else {
                console.log('User inserted successfully');
            }
        });
        stmt.finalize();

        // Seed a student
        const studentStmt = db.prepare("INSERT INTO Students (_id, name, rollNo, class, section, schoolId, isSynced, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))");
        studentStmt.run(uuidv4(), 'Local Seed Student', '1001', '10', 'A', 'DST_CHN_SCH_01', 1);
        studentStmt.finalize();

        // Seed a teacher
        const teacherStmt = db.prepare("INSERT INTO Teachers (_id, name, userId, schoolId, subjects, isSynced, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))");
        teacherStmt.run(uuidv4(), 'Physics Teacher', user._id, 'DST_CHN_SCH_01', JSON.stringify([{ subject: 'Physics' }]), 1);
        teacherStmt.finalize();

        // Seed a School
        const schoolStmt = db.prepare("INSERT INTO Schools (_id, name, code, districtId, createdAt, updatedAt) VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))");
        schoolStmt.run('DST_CHN_SCH_01', 'Chennai Public School', 'SCH_01', 'DST_CHN'); // Using string ID
        schoolStmt.finalize();
    });

    // Close
    // db.close(); // Keep open for a bit
    setTimeout(() => {
        console.log("Seeding done.");
        db.close();
    }, 1000);
};

seedLocalQuery();
