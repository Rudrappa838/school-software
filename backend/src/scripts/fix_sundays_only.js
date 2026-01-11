require('dotenv').config();
const { pool } = require('../config/db');

async function fixSundaysOnly() {
    const client = await pool.connect();
    try {
        console.log('=== FIXING: KEEPING ONLY SUNDAYS ===');

        const SCHOOL_ID = 1;

        // 1. Delete ALL weekly markers (Friday, Saturday, Sunday) to start clean
        console.log('Removing all Saturday, Sunday, Friday markers...');
        await client.query(`
            DELETE FROM events 
            WHERE school_id = $1 
            AND title IN ('Sunday', 'Saturday', 'Friday', 'Weekly Holiday')
            AND start_date >= '2026-01-01'
        `, [SCHOOL_ID]);

        console.log('✅ Cleaned up incorrect days.');

        const year = 2026;
        let sundaysAdded = 0;

        // 2. Add ONLY Sunday
        for (let month = 0; month < 12; month++) {
            const daysInMonth = new Date(year, month + 1, 0).getDate();

            for (let day = 1; day <= daysInMonth; day++) {
                // Set time to NOON (12:00 PM) to prevent it from shifting to previous day
                const date = new Date(year, month, day, 12, 0, 0);

                // 0 is Sunday
                if (date.getDay() === 0) {
                    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

                    await client.query(
                        `INSERT INTO events 
                        (school_id, title, event_type, start_date, end_date, description, audience)
                        VALUES ($1, 'Sunday', 'Holiday', $2, $2, 'Weekly Holiday', 'All')`,
                        [SCHOOL_ID, dateStr]
                    );
                    sundaysAdded++;
                }
            }
        }

        console.log(`\n✅ Added ${sundaysAdded} Sundays correctly.`);
        console.log('NOTE: Saturdays and Fridays are NOT marked.');

    } catch (error) {
        console.error('❌ Error fixing Sundays:', error);
    } finally {
        client.release();
        process.exit(0);
    }
}

fixSundaysOnly();
