const { pool } = require('../config/db');

async function checkSync() {
    const school_id = 1;
    const client = await pool.connect();
    try {
        const date = '2026-06-15';
        const name = 'Test Sync Holiday';

        console.log('Adding holiday...');
        // Simulating the controller logic
        await client.query('BEGIN');
        await client.query('INSERT INTO school_holidays (school_id, holiday_date, holiday_name) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING', [school_id, date, name]);
        await client.query(`INSERT INTO events (school_id, title, event_type, start_date, end_date) VALUES ($1, $2, 'Holiday', $3, $3) ON CONFLICT DO NOTHING`, [school_id, name, date]);
        await client.query('COMMIT');

        console.log('Checking school_holidays...');
        const hRes = await client.query('SELECT * FROM school_holidays WHERE holiday_date = $1', [date]);
        console.log(hRes.rows);

        console.log('Checking events...');
        const eRes = await client.query('SELECT * FROM events WHERE start_date = $1 AND event_type = \'Holiday\'', [date]);
        console.log(eRes.rows);

    } catch (e) {
        console.error(e);
    } finally {
        client.release();
        process.exit(0);
    }
}

checkSync();
