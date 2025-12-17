const { pool } = require('../config/db');

async function fixRudruTeacher() {
    const client = await pool.connect();
    try {
        const email = 'rudru8888@gmail.com';
        console.log(`Checking teacher record for ${email}...`);

        const check = await client.query("SELECT * FROM teachers WHERE email = $1", [email]);

        if (check.rows.length === 0) {
            console.log("Teacher record missing! Creating now...");

            // Assuming school_id = 1
            const res = await client.query(`
                INSERT INTO teachers (school_id, name, email, phone, subject_specialization, gender, join_date, employee_id, salary_per_day)
                VALUES (1, 'Rudrappa Machakanur', $1, '9988776655', 'Science', 'Male', NOW(), 'EMP999', 1000)
                RETURNING *;
            `, [email]);

            console.log("Created Teacher:", res.rows[0]);
        } else {
            console.log("Teacher record already exists:", check.rows[0]);
        }

        // Add some dummy attendance for testing
        const teacherRes = await client.query("SELECT id FROM teachers WHERE email = $1", [email]);
        const teacherId = teacherRes.rows[0].id;

        console.log(`Adding dummy attendance for Teacher ID: ${teacherId}`);
        const today = new Date().toISOString().split('T')[0];

        await client.query(`
            INSERT INTO teacher_attendance (school_id, teacher_id, date, status)
            VALUES (1, $1, $2, 'Present')
            ON CONFLICT (teacher_id, date) DO UPDATE SET status = 'Present'
        `, [teacherId, today]);

        console.log("Attendance marked as Present for today.");

    } catch (err) {
        console.error(err);
    } finally {
        client.release();
        pool.end();
    }
}

fixRudruTeacher();
