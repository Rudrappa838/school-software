const { pool } = require('../config/db');

async function checkStaffIds() {
    try {
        const client = await pool.connect();
        const res = await client.query('SELECT id, name, employee_id, role, phone FROM staff');
        console.log('--- Current Staff List ---');
        console.log(JSON.stringify(res.rows, null, 2));
        client.release();
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

checkStaffIds();
