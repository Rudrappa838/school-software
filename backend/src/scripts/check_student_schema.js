const { pool } = require('../config/db');

async function checkStudentSchema() {
    const client = await pool.connect();
    try {
        const cols = await client.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'students'
        `);
        console.log('Students Columns:', cols.rows);
    } catch (err) {
        console.error(err);
    } finally {
        client.release();
        pool.end();
    }
}

checkStudentSchema();
