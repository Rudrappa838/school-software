const { pool } = require('../config/db');

async function checkLeaveSchema() {
    const client = await pool.connect();
    try {
        const cols = await client.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'leaves'
        `);
        console.log('Leaves Columns:', cols.rows);
    } catch (err) {
        console.error(err);
    } finally {
        client.release();
        pool.end();
    }
}

checkLeaveSchema();
