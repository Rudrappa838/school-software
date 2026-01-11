const { pool } = require('../config/db');

async function checkHolidaysCols() {
    const client = await pool.connect();
    try {
        const res = await client.query('SELECT column_name FROM information_schema.columns WHERE table_name = \'school_holidays\'');
        res.rows.forEach(r => console.log(r.column_name));
    } catch (e) {
        console.error(e);
    } finally {
        client.release();
        process.exit(0);
    }
}

checkHolidaysCols();
