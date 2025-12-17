const { pool } = require('../config/db');

async function fixTeacher() {
    const client = await pool.connect();
    try {
        console.log("Fixing teacher record for teacher@demo.com...");

        // Check if exists
        const check = await client.query("SELECT * FROM teachers WHERE email = 'teacher@demo.com'");
        if (check.rows.length > 0) {
            console.log("Teacher already exists.");
            return;
        }

        // Insert
        const res = await client.query(`
            INSERT INTO teachers (school_id, name, email, phone, subject_specialization, gender, join_date, employee_id, salary_per_day)
            VALUES (1, 'Demo Teacher', 'teacher@demo.com', '9876543210', 'Mathematics', 'Male', NOW(), 'EMP001', 500)
            RETURNING *;
        `);

        console.log("Inserted Teacher:", res.rows[0]);

    } catch (err) {
        console.error(err);
    } finally {
        client.release();
        pool.end();
    }
}

fixTeacher();
