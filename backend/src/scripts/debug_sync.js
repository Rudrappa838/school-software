require('dotenv').config();
const { pool } = require('../config/db');

async function debugSync() {
    try {
        console.log('=== DEBUG SYNC ===');
        const school_id = 1;

        // 1. Check Events Table Columns
        const cols = await pool.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'events'
        `);
        console.log('Events Columns:', cols.rows.map(r => r.column_name).join(', '));

        // 2. Try the Sync Logic
        console.log('\nFetching holidays...');
        const events = await pool.query(`
            SELECT id, title, start_date, event_type 
            FROM events 
            WHERE school_id = $1 
            AND event_type = 'Holiday'
        `, [school_id]);

        console.log(`Found ${events.rows.length} holidays.`);
        if (events.rows.length > 0) {
            console.log('Sample event:', events.rows[0]);
        }

        // 3. Try Insert Logic
        console.log('\nTrying Insert on school_holidays...');
        if (events.rows.length > 0) {
            const ev = events.rows[0];
            const dateStr = new Date(ev.start_date).toISOString().split('T')[0];

            await pool.query(`
                INSERT INTO school_holidays (school_id, holiday_date, holiday_name, is_paid)
                VALUES ($1, $2, $3, true)
                ON CONFLICT (school_id, holiday_date) DO NOTHING
            `, [school_id, dateStr, ev.title]);
            console.log('Insert Successful (or skipped if duplicate)');
        }

    } catch (e) {
        console.error('❌ ERROR:', e);
    } finally {
        pool.end();
    }
}

debugSync();
