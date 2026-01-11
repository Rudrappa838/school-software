require('dotenv').config();
const { pool } = require('../config/db');

async function checkCalendarEvents() {
    try {
        console.log('=== CHECKING CALENDAR EVENTS ===');

        // Get a sample of "Sunday" events
        const res = await pool.query(`
            SELECT title, start_date, event_type 
            FROM events 
            WHERE title = 'Sunday' 
            AND school_id = 1
            ORDER BY start_date ASC
            LIMIT 5
        `);

        console.log('\nChecking first 5 Sunday entries:');
        res.rows.forEach(event => {
            const date = new Date(event.start_date);
            const dayOfWeek = date.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

            console.log(`Date: ${event.start_date.toISOString().split('T')[0]} | Title: ${event.title} | Actual Day: ${days[dayOfWeek]}`);

            if (dayOfWeek !== 0) {
                console.error('❌ ERROR: This date is NOT a Sunday!');
            } else {
                console.log('✅ Correct');
            }
        });

    } catch (error) {
        console.error('Error:', error);
    } finally {
        pool.end();
    }
}

checkCalendarEvents();
