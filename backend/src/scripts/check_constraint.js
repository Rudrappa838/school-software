require('dotenv').config();
const { pool } = require('../config/db');

async function checkConstraint() {
    try {
        console.log('Checking constraints on school_holidays...');
        const res = await pool.query(`
            SELECT conname, pg_get_constraintdef(oid) 
            FROM pg_constraint 
            WHERE conrelid = 'school_holidays'::regclass
        `);
        console.log(res.rows);
    } catch (e) {
        console.error(e);
    } finally {
        pool.end();
    }
}
checkConstraint();
