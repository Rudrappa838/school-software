const { pool } = require('../config/db');

async function testAutoMark() {
    const client = await pool.connect();
    try {
        const school_id = 1;
        const year = 2026;
        const month = 'all';

        console.log('Testing Auto-Mark Holidays...\n');

        await client.query('BEGIN');

        // Get all teachers, staff, and students
        const teachers = await client.query('SELECT id FROM teachers WHERE school_id = $1', [school_id]);
        const staff = await client.query('SELECT id FROM staff WHERE school_id = $1', [school_id]);
        const students = await client.query('SELECT id FROM students WHERE school_id = $1 AND (status IS NULL OR status != \'Deleted\')', [school_id]);

        console.log(`Found: ${teachers.rows.length} teachers, ${staff.rows.length} staff, ${students.rows.length} students`);

        const monthsToProcess = (month === 'all') ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] : [parseInt(month)];
        let totalDaysMarked = 0;

        for (const m of monthsToProcess) {
            const daysInMonth = new Date(year, m, 0).getDate();
            const startStr = `${year}-${String(m).padStart(2, '0')}-01`;
            const endStr = `${year}-${String(m).padStart(2, '0')}-${String(daysInMonth).padStart(2, '0')}`;

            // Fetch Holidays
            const holidays = await client.query(
                `SELECT TO_CHAR(holiday_date, 'YYYY-MM-DD') as hdate FROM school_holidays 
                 WHERE school_id = $1 AND holiday_date >= $2 AND holiday_date <= $3`,
                [school_id, startStr, endStr]
            );
            const holidayDates = holidays.rows.map(h => h.hdate);

            if (holidayDates.length > 0) {
                console.log(`Month ${m}: ${holidayDates.length} holidays`);
                totalDaysMarked += holidayDates.length;
            }
        }

        await client.query('ROLLBACK');
        console.log(`\n✅ Would mark ${totalDaysMarked} holiday days for all users`);

    } catch (e) {
        console.error('❌ Error:', e.message);
        console.error('Stack:', e.stack);
        await client.query('ROLLBACK');
    } finally {
        client.release();
        process.exit(0);
    }
}

testAutoMark();
