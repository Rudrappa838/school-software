require('dotenv').config();
const { pool } = require('../config/db');

async function fixWeekendHolidays() {
    const client = await pool.connect();
    try {
        console.log('=== FIXING WEEKEND HOLIDAYS ===');

        const SCHOOL_ID = 1;

        // 1. Delete existing Sunday/Saturday events to strictly clean up
        console.log('Cleaning up old entries...');
        await client.query(`
            DELETE FROM events 
            WHERE school_id = $1 
            AND (title = 'Sunday' OR title = 'Saturday')
            AND start_date >= '2026-01-01'
        `, [SCHOOL_ID]);

        const year = 2026;
        let sundaysAdded = 0;
        let saturdaysAdded = 0;

        for (let month = 0; month < 12; month++) {
            const daysInMonth = new Date(year, month + 1, 0).getDate();

            for (let day = 1; day <= daysInMonth; day++) {
                // Create date at NOON to avoid timezone shifts (e.g., 2026-01-04 12:00:00)
                const date = new Date(year, month, day, 12, 0, 0);
                const dayOfWeek = date.getDay();

                const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

                // Sunday (0)
                if (dayOfWeek === 0) {
                    await client.query(
                        `INSERT INTO events 
                        (school_id, title, event_type, start_date, end_date, description, audience)
                        VALUES ($1, 'Sunday', 'Holiday', $2, $2, 'Weekly Holiday', 'All')`,
                        [SCHOOL_ID, dateStr]
                    );
                    sundaysAdded++;
                }

                // Saturday (6) - The user wanted this too ("keep that also")
                if (dayOfWeek === 6) {
                    await client.query(
                        `INSERT INTO events 
                        (school_id, title, event_type, start_date, end_date, description, audience)
                        VALUES ($1, 'Saturday', 'Holiday', $2, $2, 'Weekly Holiday', 'All')`,
                        [SCHOOL_ID, dateStr]
                    );
                    saturdaysAdded++;
                }
            }
        }

        console.log('\n=== SUMMARY ===');
        console.log(`Fixed Sundays Added: ${sundaysAdded}`);
        console.log(`Fixed Saturdays Added: ${saturdaysAdded}`);
        console.log('\nNOTE: Dates are now correct. Sync from Calendar again to update Holiday Management!');

    } catch (error) {
        console.error('❌ Error fixing weekends:', error);
    } finally {
        client.release();
        process.exit(0);
    }
}

fixWeekendHolidays();
