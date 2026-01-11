const { pool } = require('../config/db');

async function checkEventsSchema() {
    const client = await pool.connect();
    try {
        const res = await client.query('SELECT column_name FROM information_schema.columns WHERE table_name = \'events\'');
        res.rows.forEach(r => console.log(r.column_name));
    } catch (e) {
        console.error(e);
    } finally {
        client.release();
        process.exit(0);
    }
}

checkEventsSchema();
