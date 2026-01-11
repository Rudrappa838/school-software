require('dotenv').config();
const { pool } = require('../config/db');

async function recreateAttendanceTables() {
    const client = await pool.connect();
    try {
        console.log('=== RECREATING ATTENDANCE TABLES ===\n');

        await client.query('BEGIN');

        // Drop existing tables
        console.log('Dropping existing tables...');
        await client.query('DROP TABLE IF EXISTS teacher_attendance CASCADE');
        await client.query('DROP TABLE IF EXISTS staff_attendance CASCADE');
        console.log('✅ Tables dropped');

        // Create teacher_attendance without foreign keys
        console.log('\nCreating teacher_attendance table...');
        await client.query(`
            CREATE TABLE teacher_attendance (
                id SERIAL PRIMARY KEY,
                school_id INTEGER NOT NULL,
                teacher_id INTEGER NOT NULL,
                date DATE NOT NULL,
                status VARCHAR(20) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(teacher_id, date)
            );
        `);
        console.log('✅ teacher_attendance created');

        // Create staff_attendance without foreign keys
        console.log('\nCreating staff_attendance table...');
        await client.query(`
            CREATE TABLE staff_attendance (
                id SERIAL PRIMARY KEY,
                school_id INTEGER NOT NULL,
                staff_id INTEGER NOT NULL,
                date DATE NOT NULL,
                status VARCHAR(20) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(staff_id, date)
            );
        `);
        console.log('✅ staff_attendance created');

        // Create indexes for better performance
        console.log('\nCreating indexes...');
        await client.query('CREATE INDEX idx_teacher_attendance_date ON teacher_attendance(date)');
        await client.query('CREATE INDEX idx_teacher_attendance_teacher ON teacher_attendance(teacher_id)');
        await client.query('CREATE INDEX idx_staff_attendance_date ON staff_attendance(date)');
        await client.query('CREATE INDEX idx_staff_attendance_staff ON staff_attendance(staff_id)');
        console.log('✅ Indexes created');

        await client.query('COMMIT');
        console.log('\n✅ SUCCESS! Tables recreated without foreign key constraints.');
        console.log('\nYou can now use auto-mark holidays!');

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('\n❌ ERROR:', error.message);
    } finally {
        client.release();
        process.exit(0);
    }
}

recreateAttendanceTables();
