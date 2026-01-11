const { pool } = require('../config/db');

async function checkConstraints() {
    const client = await pool.connect();
    try {
        const res = await client.query('SELECT conname, pg_get_constraintdef(oid) FROM pg_constraint WHERE conrelid = \'attendance\'::regclass');
        res.rows.forEach(r => {
            console.log(r.conname);
            console.log(r.pg_get_constraintdef.substring(0, 100));
            console.log(r.pg_get_constraintdef.substring(100, 200));
            console.log(r.pg_get_constraintdef.substring(200, 300));
        });
    } catch (e) {
        console.error(e);
    } finally {
        client.release();
        process.exit(0);
    }
}

checkConstraints();
