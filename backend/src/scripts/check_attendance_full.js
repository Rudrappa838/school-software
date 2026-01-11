const { pool } = require('../config/db');

async function checkAttendanceFull() {
    const client = await pool.connect();
    try {
        const res = await client.query('SELECT * FROM attendance WHERE student_id = 3 AND date >= \'2026-01-01\' AND date <= \'2026-01-31\' ORDER BY date');
        console.log(JSON.stringify(res.rows, null, 2));
    } catch (e) {
        console.error(e);
    } finally {
        client.release();
        process.exit(0);
    }
}

checkAttendanceFull();
