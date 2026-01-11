const { pool } = require('../config/db');

async function checkData() {
    const school_id = 1;
    console.log(`--- Checking Data for School ID ${school_id} ---`);
    const client = await pool.connect();
    try {
        // 1. Check School Holidays
        const hRes = await client.query('SELECT holiday_date, holiday_name FROM school_holidays WHERE school_id = $1 AND holiday_date >= \'2026-01-01\' AND holiday_date <= \'2026-01-31\' ORDER BY holiday_date', [school_id]);
        console.log('\n[school_holidays] for Jan 2026:');
        hRes.rows.forEach(r => {
            console.log(`- ${r.holiday_date.toISOString().split('T')[0]}: ${r.holiday_name}`);
        });

        // 2. Check Attendance for first student
        const sRes = await client.query('SELECT id, name FROM students WHERE school_id = $1 LIMIT 1', [school_id]);
        if (sRes.rows.length > 0) {
            const student = sRes.rows[0];
            console.log(`\n[attendance] for student: ${student.name} (ID: ${student.id})`);
            const aRes = await client.query('SELECT date, status FROM attendance WHERE student_id = $1 AND date >= \'2026-01-01\' AND date <= \'2026-01-31\' ORDER BY date', [student.id]);
            aRes.rows.forEach(r => {
                console.log(`- ${r.date.toISOString().split('T')[0]}: ${r.status}`);
            });
        }
    } catch (e) {
        console.error(e);
    } finally {
        client.release();
        process.exit(0);
    }
}

checkData();
