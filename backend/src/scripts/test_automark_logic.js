const { pool } = require('../config/db');

async function testAutoMark() {
    const school_id = 1;
    const year = 2026;
    const client = await pool.connect();
    try {
        console.log('Fetching holidays...');
        const holidaysRes = await client.query(
            "SELECT TO_CHAR(holiday_date, 'YYYY-MM-DD') as date_str FROM school_holidays WHERE school_id = $1 AND EXTRACT(YEAR FROM holiday_date) = $2",
            [school_id, year]
        );
        const holidayDates = holidaysRes.rows.map(r => r.date_str);

        console.log(`Found ${holidayDates.length} holidays. Fetching users...`);
        const teachers = await client.query('SELECT id FROM teachers WHERE school_id = $1', [school_id]);
        const staff = await client.query('SELECT id FROM staff WHERE school_id = $1', [school_id]);
        const students = await client.query('SELECT id FROM students WHERE school_id = $1', [school_id]);

        const teacherIds = teachers.rows.map(r => r.id);
        const staffIds = staff.rows.map(r => r.id);
        const studentIds = students.rows.map(r => r.id);

        console.log(`Teachers: ${teacherIds.length}, Staff: ${staffIds.length}, Students: ${studentIds.length}`);

        await client.query('BEGIN');

        if (teacherIds.length > 0 && holidayDates.length > 0) {
            console.log('Marking teachers...');
            await client.query(`
                INSERT INTO teacher_attendance (school_id, teacher_id, date, status)
                SELECT $1, t_id, d_date::date, 'Holiday'
                FROM unnest($2::int[]) as t_id
                CROSS JOIN unnest($3::text[]) as d_date
                ON CONFLICT (teacher_id, date) DO UPDATE SET status = 'Holiday'
            `, [school_id, teacherIds, holidayDates]);
        }

        await client.query('COMMIT');
        console.log('✅ Success!');

    } catch (e) {
        console.error('❌ Error:', e);
        await client.query('ROLLBACK');
    } finally {
        client.release();
        process.exit(0);
    }
}

testAutoMark();
