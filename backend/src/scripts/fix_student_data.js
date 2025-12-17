const { pool } = require('../config/db');

async function fixStudent() {
    const client = await pool.connect();
    try {
        console.log("Checking student record for student@demo.com...");

        // Check if exists
        const check = await client.query("SELECT * FROM students WHERE email = 'student@demo.com'");
        if (check.rows.length > 0) {
            console.log("Student already exists:", check.rows[0]);
            return;
        }

        console.log("Student missing, inserting...");
        // Insert
        const res = await client.query(`
            INSERT INTO students (school_id, name, email, roll_number, admission_no, parent_name, contact_number, gender, dob, address, class_id, section_id, admission_date)
            VALUES (1, 'Demo Student', 'student@demo.com', 101, 'ADM001', 'Demo Parent', '9998887776', 'Male', '2010-01-01', 'Test Address', NULL, NULL, NOW())
            RETURNING *;
        `);

        console.log("Inserted Student:", res.rows[0]);

    } catch (err) {
        console.error(err);
    } finally {
        client.release();
        pool.end();
    }
}

fixStudent();
