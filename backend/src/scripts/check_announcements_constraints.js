const { pool } = require('../config/db');

async function checkConstraints() {
    try {
        const client = await pool.connect();

        console.log('--- Checking Constraints for announcements ---');
        const res = await client.query(`
            SELECT conname, pg_get_constraintdef(c.oid)
            FROM pg_constraint c
            JOIN pg_namespace n ON n.oid = c.connamespace
            WHERE conrelid = 'public.announcements'::regclass;
        `);

        res.rows.forEach(r => {
            console.log(`${r.conname}: ${r.pg_get_constraintdef}`);
        });

        client.release();
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

checkConstraints();
