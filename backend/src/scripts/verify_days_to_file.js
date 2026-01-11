require('dotenv').config();
const { pool } = require('../config/db');
const fs = require('fs');

async function checkCalendarEvents() {
    try {
        const res = await pool.query(`
            SELECT title, start_date 
            FROM events 
            WHERE title = 'Sunday' 
            AND school_id = 1
            ORDER BY start_date ASC
            LIMIT 10
        `);

        let output = '=== SUNDAY CHECK REPORT ===\n';

        res.rows.forEach(event => {
            // Adjust for timezone offset if necessary, but keep it simple
            // We want to see what is stored in DB
            const dbDate = new Date(event.start_date);
            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const dayName = days[dbDate.getDay()];

            output += `Date: ${dbDate.toISOString().split('T')[0]} | Day: ${dayName}\n`;
        });

        fs.writeFileSync('sunday_check_report.txt', output);
        console.log('Report written to sunday_check_report.txt');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        pool.end();
    }
}

checkCalendarEvents();
