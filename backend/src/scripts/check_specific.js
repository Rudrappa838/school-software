const { pool } = require('../config/db');

async function checkSpecificDates() {
    const client = await pool.connect();
    try {
        const studentId = 3;
        const res = await client.query('SELECT TO_CHAR(date, \'YYYY-MM-DD\') as adate, status FROM attendance WHERE student_id = $1 AND date >= \'2026-01-01\' AND date <= \'2026-01-10\' ORDER BY date', [studentId]);
        console.log(`Attendance for Student 3 (Jan 1-10 2026):`);
        res.rows.forEach(r => {
            console.log(`${r.adate}: ${r.status}`);
        });
    } catch (e) {
        console.error(e);
    } finally {
        client.release();
        process.exit(0);
    }
}

checkSpecificDates();
