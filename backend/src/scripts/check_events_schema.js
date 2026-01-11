const { pool } = require('../config/db');

async function checkEventsSchema() {
    const client = await pool.connect();
    try {
        const res = await client.query('SELECT column_name, data_type FROM information_schema.columns WHERE table_name = \'events\'');
        console.log(res.rows);
    } catch (e) {
        console.error(e);
    } finally {
        client.release();
        process.exit(0);
    }
}

checkEventsSchema();
