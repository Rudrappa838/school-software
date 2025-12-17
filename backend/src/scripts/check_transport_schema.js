const { pool } = require('../config/db');

async function checkTransportSchema() {
    try {
        const client = await pool.connect();

        console.log("Checking columns for 'transport_routes'...");
        const res = await client.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'transport_routes';
        `);
        console.log(JSON.stringify(res.rows));

        console.log("Checking columns for 'transport_vehicles'...");
        const res2 = await client.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'transport_vehicles';
        `);
        console.log(JSON.stringify(res2.rows));

        client.release();
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

checkTransportSchema();
