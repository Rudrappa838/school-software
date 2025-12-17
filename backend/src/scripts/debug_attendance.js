const { pool } = require('../config/db');

async function debugAttendance() {
    try {
        const email = 'rudru888@gmail.com';
        console.log(`Checking attendance for email: ${email}`);

        // 1. Resolve Student ID
        let student_id = null;
        let school_id = 1; // Default
        const studentRes = await pool.query('SELECT id, school_id FROM students WHERE email = $1', [email]);
        if (studentRes.rows.length > 0) {
            student_id = studentRes.rows[0].id;
            school_id = studentRes.rows[0].school_id;
            console.log(`Found Student ID: ${student_id}, School ID: ${school_id}`);
        } else {
            console.log('Student not found by email.');
            return;
        }

        // 2. Check ANY attendance records for this student
        const anyRes = await pool.query('SELECT COUNT(*) FROM attendance WHERE student_id = $1', [student_id]);
        console.log(`Total Attendance Records for Student ${student_id}: ${anyRes.rows[0].count}`);

        // 3. Check for Current Month (Assuming Dec 2025 based on prev context, or just check recent)
        // Actually user said "data not coming", so probably expected some data 
        const recentRes = await pool.query('SELECT * FROM attendance WHERE student_id = $1 ORDER BY date DESC LIMIT 5', [student_id]);
        console.log('Recent 5 Attendance Records:');
        console.log(recentRes.rows);

        // 4. Check Date Format Handling
        const month = 12;
        const year = 2025;
        const startDate = `${year}-${month}-01`;
        const endDate = new Date(year, month, 0).toISOString().split('T')[0];
        console.log(`Querying range: ${startDate} to ${endDate}`);

        const rangeRes = await pool.query(`
            SELECT date, status 
            FROM attendance 
            WHERE student_id = $1 AND date >= $2 AND date <= $3
            ORDER BY date
        `, [student_id, startDate, endDate]);
        console.log(`Records in range: ${rangeRes.rows.length}`);

    } catch (error) {
        console.error(error);
    } finally {
        pool.end();
    }
}

debugAttendance();
