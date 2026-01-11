const { pool } = require('../config/db');

async function checkAttendanceTimestamps() {
    const client = await pool.connect();
    try {
        const res = await client.query('SELECT id, TO_CHAR(date, \'YYYY-MM-DD\') as date, status, created_at FROM attendance WHERE school_id = 1 AND date >= \'2026-01-01\' AND date <= \'2026-01-31\' AND status = \'Present\' LIMIT 20');
        console.log(res.rows);
    } catch (e) {
        console.error(e);
    } finally {
        client.release();
        process.exit(0);
    }
}

checkAttendanceTimestamps();
