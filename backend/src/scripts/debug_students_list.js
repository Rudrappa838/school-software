const { pool } = require('../config/db');

async function debugStudents() {
    try {
        const res = await pool.query('SELECT id, first_name, last_name, admission_no FROM students LIMIT 10');
        console.table(res.rows);
    } catch (error) {
        console.error(error);
    } finally {
        pool.end();
    }
}

debugStudents();
