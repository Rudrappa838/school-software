const { pool } = require('../config/db');

async function checkStaffTransportColumns() {
    try {
        const client = await pool.connect();

        const res = await client.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'staff';
        `);

        console.log("--- Staff Table Columns ---");
        // Use JSON.stringify for logging to avoid table truncation or misformatting in some environments
        console.log(JSON.stringify(res.rows));

        client.release();
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

checkStaffTransportColumns();
