const { pool } = require('../config/db');

async function addTestStudent() {
    try {
        const client = await pool.connect();
        try {
            // Check if exists first
            const check = await client.query("SELECT * FROM students WHERE admission_no = '255064'");
            if (check.rows.length > 0) {
                console.log('Student with admission_no 255064 already exists.');
                return;
            }

            // Insert (assuming class_id 1 exists or is nullable, sections too)
            // We need a school_id, let's assume 1 (usually the first school created)
            // Need to check if school 1 exists
            const schoolCheck = await client.query("SELECT id FROM schools LIMIT 1");
            if (schoolCheck.rows.length === 0) {
                console.log("No school found, cannot create student.");
                return;
            }
            const schoolId = schoolCheck.rows[0].id;

            const res = await client.query(`
                INSERT INTO students (school_id, first_name, last_name, admission_no, gender, parent_name, contact_number)
                VALUES ($1, 'Test', 'Student', '255064', 'Male', 'Test Parent', '1234567890')
                RETURNING *
            `, [schoolId]);

            console.log('Created student:', res.rows[0]);

        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Error adding student:', error);
    } finally {
        pool.end();
    }
}

addTestStudent();
