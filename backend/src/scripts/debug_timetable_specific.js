const { pool } = require('../config/db');

async function debugTimetable() {
    try {
        const email = 'rudru888@gmail.com';

        // 1. Get Student Class/Section
        const studentRes = await pool.query(
            'SELECT id, class_id, section_id FROM students WHERE email = $1',
            [email]
        );

        if (studentRes.rows.length === 0) {
            console.log('Student not found');
            return;
        }

        const student = studentRes.rows[0];
        console.log('Student:', student);

        // 2. Check Timetable Entries for this Class/Section
        const timetableRes = await pool.query(
            `SELECT t.*, s.name as subject_name 
             FROM timetables t
             JOIN subjects s ON t.subject_id = s.id
             WHERE t.class_id = $1 AND t.section_id = $2
             ORDER BY t.day_of_week, t.start_time`,
            [student.class_id, student.section_id]
        );

        console.log(`Found ${timetableRes.rows.length} timetable entries.`);
        console.log(timetableRes.rows);

    } catch (e) {
        console.error(e);
    } finally {
        pool.end();
    }
}
debugTimetable();
