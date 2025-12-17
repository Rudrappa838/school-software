const { pool } = require('../config/db');
const bcrypt = require('bcrypt');

const initDb = async () => {
    try {
        console.log('🔄 Initializing Database Schema...');

        // 1. Schools Table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS schools (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                address TEXT,
                contact_email VARCHAR(255) NOT NULL,
                subscription_status VARCHAR(50) DEFAULT 'ACTIVE',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('✅ Schools table ready');

        // 2. Users Table (Super Admin & School Admins)
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role VARCHAR(50) NOT NULL CHECK (role IN ('SUPER_ADMIN', 'SCHOOL_ADMIN')),
                school_id INTEGER REFERENCES schools(id) ON DELETE CASCADE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('✅ Users table ready');

        // 3. Classes Table (e.g., Class 1, Class 10)
        await pool.query(`
            CREATE TABLE IF NOT EXISTS classes (
                id SERIAL PRIMARY KEY,
                school_id INTEGER REFERENCEs schools(id) ON DELETE CASCADE,
                name VARCHAR(100) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(school_id, name)
            );
        `);
        console.log('✅ Classes table ready');

        // 4. Sections Table (e.g., Section A, Section B)
        await pool.query(`
            CREATE TABLE IF NOT EXISTS sections (
                id SERIAL PRIMARY KEY,
                class_id INTEGER REFERENCEs classes(id) ON DELETE CASCADE,
                name VARCHAR(50) NOT NULL,
                UNIQUE(class_id, name)
            );
        `);
        console.log('✅ Sections table ready');

        // 5. Subjects Table (e.g., Math, Science)
        await pool.query(`
            CREATE TABLE IF NOT EXISTS subjects (
                id SERIAL PRIMARY KEY,
                class_id INTEGER REFERENCEs classes(id) ON DELETE CASCADE,
                name VARCHAR(100) NOT NULL,
                UNIQUE(class_id, name)
            );
        `);
        console.log('✅ Subjects table ready');

        // 6. Students Table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS students (
                id SERIAL PRIMARY KEY,
                school_id INTEGER REFERENCES schools(id) ON DELETE CASCADE,
                name VARCHAR(255) NOT NULL,
                admission_no VARCHAR(50),
                gender VARCHAR(10),
                dob DATE,
                class_id INTEGER REFERENCES classes(id) ON DELETE SET NULL,
                section_id INTEGER REFERENCES sections(id) ON DELETE SET NULL,
                parent_name VARCHAR(255),
                contact_number VARCHAR(15),
                address TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(school_id, admission_no)
            );
        `);
        console.log('✅ Students table ready');

        // 7. Attendance Table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS attendance (
                id SERIAL PRIMARY KEY,
                school_id INTEGER REFERENCES schools(id) ON DELETE CASCADE,
                student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
                date DATE NOT NULL,
                status VARCHAR(10) CHECK (status IN ('Present', 'Absent', 'Late', 'Leave')),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(student_id, date)
            );
        `);
        console.log('✅ Attendance table ready');

        // Seed Super Admin if not exists
        const adminEmail = 'admin@school.com';
        const hashedPassword = await bcrypt.hash('admin123', 10);

        const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [adminEmail]);
        if (userCheck.rows.length === 0) {
            await pool.query(`
                INSERT INTO users (email, password, role) 
                VALUES ($1, $2, 'SUPER_ADMIN')
            `, [adminEmail, hashedPassword]);
            console.log('👮 Super Admin created: admin@school.com / admin123');
        } else {
            console.log('ℹ️  Super Admin already exists');
        }

    } catch (error) {
        console.error('❌ Error initializing database:', error.message);
        if (error.detail) console.error('Details:', error.detail);
    } finally {
        pool.end();
    }
};

initDb();
