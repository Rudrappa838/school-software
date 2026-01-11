const { pool } = require('../config/db');

async function testAddHoliday() {
    const client = await pool.connect();
    try {
        const school_id = 1;
        const holiday_date = '2026-06-20';
        const holiday_name = 'Test Sync Holiday 2';
        const is_paid = true;

        console.log('Testing Add Holiday with Calendar Sync...');

        await client.query('BEGIN');

        // 1. Add to school_holidays
        console.log('Step 1: Adding to school_holidays...');
        const result = await client.query(
            `INSERT INTO school_holidays (school_id, holiday_date, holiday_name, is_paid)
             VALUES ($1, $2, $3, $4)
             ON CONFLICT DO NOTHING
             RETURNING *`,
            [school_id, holiday_date, holiday_name, is_paid]
        );
        console.log('Holiday added:', result.rows[0]);

        // 2. Add to events table
        console.log('Step 2: Adding to events table...');
        const eventResult = await client.query(
            `INSERT INTO events (school_id, title, event_type, start_date, end_date, description, audience)
             VALUES ($1, $2, 'Holiday', $3, $3, $4, 'All')
             RETURNING *`,
            [school_id, holiday_name, holiday_date, is_paid ? 'Paid Holiday' : 'Holiday']
        );
        console.log('Event added:', eventResult.rows[0]);

        await client.query('COMMIT');

        // 3. Verify both tables
        console.log('\nVerifying school_holidays:');
        const hCheck = await client.query('SELECT * FROM school_holidays WHERE holiday_date = $1', [holiday_date]);
        console.log(hCheck.rows);

        console.log('\nVerifying events:');
        const eCheck = await client.query('SELECT * FROM events WHERE start_date = $1 AND event_type = \'Holiday\'', [holiday_date]);
        console.log(eCheck.rows);

        console.log('\n✅ Test Complete!');

    } catch (e) {
        console.error('❌ Error:', e.message);
        await client.query('ROLLBACK');
    } finally {
        client.release();
        process.exit(0);
    }
}

testAddHoliday();
