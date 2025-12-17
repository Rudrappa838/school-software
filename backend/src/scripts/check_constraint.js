const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

async function checkConstraint() {
    try {
        const res = await pool.query("SELECT pg_get_constraintdef(oid) FROM pg_constraint WHERE conname = 'users_role_check'");
        console.log('Constraint Definition:');
        console.log(res.rows[0]?.pg_get_constraintdef);
    } catch (err) {
        console.error(err);
    } finally {
        await pool.end();
    }
}

checkConstraint();
