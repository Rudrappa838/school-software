const { pool } = require('../config/db');

async function debugAttendance() {
    const school_id = 1;
    console.log(`--- Debugging Attendance for School ID ${school_id} (Jan 2026) ---`);
    const client = await pool.connect();
    try {
        // 1. Check School Holidays
        const holidays = await client.query(`
            SELECT holiday_date, holiday_name 
            FROM school_holidays 
            WHERE school_id = $1 AND holiday_date >= '2026-01-01' AND holiday_date <= '2026-01-31'
            ORDER BY holiday_date
        `, [school_id]);

        console.log('\n--- Registered Holidays in School Management ---');
        holidays.rows.forEach(h => {
            console.log(`${h.holiday_date.toISOString().split('T')[0]} - ${h.holiday_name}`);
        });

        // 2. Check Attendance for a sample teacher/staff
        const teacherAtt = await client.query(`
            SELECT date, status 
            FROM teacher_attendance 
            WHERE school_id = $1 AND date >= '2026-01-01' AND date <= '2026-01-31'
            AND teacher_id = (SELECT id FROM teachers WHERE school_id = $1 LIMIT 1)
            ORDER BY date
        `, [school_id]);

        console.log('\n--- Sample Teacher Attendance Statuses ---');
        teacherAtt.rows.forEach(a => {
            console.log(`${a.date.toISOString().split('T')[0]}: ${a.status}`);
        });

    } catch (e) {
        console.error(e);
    } finally {
        client.release();
        process.exit(0);
    }
}

debugAttendance();
