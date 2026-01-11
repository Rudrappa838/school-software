require('dotenv').config();
const { pool } = require('../config/db');

async function testSyncFromCalendar() {
    try {
        console.log('=== TESTING SYNC FROM CALENDAR ===\n');

        const school_id = 1;
        const year = 2026;

        console.log(`Checking events for School ID: ${school_id}, Year: ${year}`);

        // 1. Check if events exist
        const events = await pool.query(
            `SELECT id, title, start_date, event_type 
             FROM events 
             WHERE school_id = $1 
             AND event_type = 'Holiday'
             ORDER BY start_date`,
            [school_id]
        );

        console.log(`\nFound ${events.rows.length} total holiday events.`);
        if (events.rows.length > 0) {
            console.log('Sample event:', events.rows[0]);
            console.log('Start date type:', typeof events.rows[0].start_date);
            // Check if EXTRACT works
            try {
                const checkExtract = await pool.query(
                    `SELECT id, start_date, EXTRACT(YEAR FROM start_date) as yr
                     FROM events 
                     WHERE school_id = $1 LIMIT 1`,
                    [school_id]
                );
                console.log('\nEXTRACT check:', checkExtract.rows[0]);
            } catch (e) {
                console.error('\n❌ EXTRACT failed:', e.message);
                console.log('This means start_date might NOT be a DATE column.');
            }
        }

        // 2. Try the actual sync logic
        console.log('\nSimulating Sync...');
        const syncQuery = `
            SELECT id, title, start_date 
            FROM events 
            WHERE school_id = $1 
            AND event_type = 'Holiday'
            AND EXTRACT(YEAR FROM start_date) = $2
        `;

        try {
            const holidays = await pool.query(syncQuery, [school_id, year]);
            console.log(`✅ Query successful! Found ${holidays.rows.length} holidays for ${year}`);

            // Try inserting one
            if (holidays.rows.length > 0) {
                const h = holidays.rows[0];
                console.log(`\nTrying to insert: ${h.title} (${h.start_date})`);

                // Note: We won't actually insert to avoid modifying DB in test, unless necessary
                // But looking at the error reported by user ("Failed to sync"), it's likely a 500 error.

            }

        } catch (err) {
            console.error('\n❌ Sync Query Failed:', err.message);
        }

    } catch (error) {
        console.error('Test Error:', error);
    } finally {
        pool.end();
    }
}

testSyncFromCalendar();
