const { pool } = require('../config/db');

async function checkExamSchema() {
    try {
        const res = await pool.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'exam_types'
        `);
        console.log('Exam Types Columns:', res.rows.map(r => r.column_name));

        const marksRes = await pool.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'marks'
        `);
        console.log('Marks Columns:', marksRes.rows.map(r => r.column_name));

    } catch (e) {
        console.error(e);
    } finally {
        pool.end();
    }
}
checkExamSchema();
