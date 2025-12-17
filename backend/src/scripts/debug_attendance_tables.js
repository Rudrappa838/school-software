const { pool } = require('../config/db');

async function checkAttendanceData() {
    try {
        const email = 'rudru888@gmail.com';
        const studentRes = await pool.query('SELECT id from students WHERE email = $1', [email]);
        if (studentRes.rows.length === 0) { console.log('Student not found'); return; }
        const student_id = studentRes.rows[0].id;

        console.log(`Checking attendance for Student ID: ${student_id}`);

        const attRes = await pool.query('SELECT COUNT(*) FROM attendance WHERE student_id = $1', [student_id]);
        console.log(`Rows in 'attendance' table: ${attRes.rows[0].count}`);

        const sAttRes = await pool.query('SELECT COUNT(*) FROM student_attendance WHERE student_id = $1', [student_id]);
        console.log(`Rows in 'student_attendance' table: ${sAttRes.rows[0].count}`);

    } catch (e) {
        console.error(e);
    } finally {
        pool.end();
    }
}
checkAttendanceData();
