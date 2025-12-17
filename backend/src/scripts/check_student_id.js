const { pool } = require('../config/db');

async function checkStudent() {
    try {
        const res = await pool.query('SELECT id, name, email, school_id FROM students WHERE email = $1', ['rudru888@gmail.com']);
        console.log('Student Lookup:', res.rows);

        if (res.rows.length > 0) {
            const sid = res.rows[0].id;
            const classRes = await pool.query('SELECT class_id FROM students WHERE id = $1', [sid]);
            console.log('Class Lookup:', classRes.rows);
        }
    } catch (e) {
        console.error(e);
    }
}

checkStudent();
