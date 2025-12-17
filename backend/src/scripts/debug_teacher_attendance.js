const { pool } = require('../config/db');

async function checkTeacherAttendance() {
    const client = await pool.connect();
    try {
        const email = 'rudru8888@gmail.com'; // The email the user is using

        console.log(`Checking for teacher: ${email}`);

        const tRes = await client.query('SELECT * FROM teachers WHERE email = $1', [email]);
        if (tRes.rows.length === 0) {
            console.log('Teacher not found in DB!');
            // Let's list all teachers to be sure
            const allT = await client.query('SELECT id, email, name FROM teachers');
            console.log('All Teachers:', allT.rows);
            return;
        }

        const teacher = tRes.rows[0];
        console.log('Teacher Found:', teacher);

        console.log('--- Attendance Records ---');
        const attRes = await client.query('SELECT * FROM teacher_attendance WHERE teacher_id = $1', [teacher.id]);
        console.log(attRes.rows);

        // Debug Date Logic
        const month = "12";
        const year = "2025";
        const startDate = `${year}-${month.padStart(2, '0')}-01`;
        const endDate = new Date(year, month, 0).toISOString().split('T')[0];
        console.log(`Test Date Range for Dec 2025: ${startDate} to ${endDate}`);

    } catch (err) {
        console.error(err);
    } finally {
        client.release();
        pool.end();
    }
}

checkTeacherAttendance();
