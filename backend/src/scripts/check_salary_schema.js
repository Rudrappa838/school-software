const { pool } = require('../config/db');

async function checkSalarySchema() {
    const client = await pool.connect();
    try {
        const res = await client.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'salary_payments';
        `);
        console.log(JSON.stringify(res.rows));
    } catch (e) {
        console.log(e);
    } finally {
        client.release();
        process.exit();
    }
}
checkSalarySchema();
