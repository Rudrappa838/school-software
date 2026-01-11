const { pool } = require('../config/db');

async function checkAttendanceClean() {
    const client = await pool.connect();
    try {
        const res = await client.query('SELECT id, TO_CHAR(date, \'YYYY-MM-DD\') as date, status FROM attendance WHERE student_id = 3 AND date >= \'2026-01-01\' AND date <= \'2026-01-31\' ORDER BY date');
        res.rows.forEach(r => console.log(`${r.id} | ${r.date} | ${r.status}`));
    } catch (e) {
        console.error(e);
    } finally {
        client.release();
        process.exit(0);
    }
}

checkAttendanceClean();
