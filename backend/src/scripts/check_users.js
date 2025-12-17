const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

async function checkUsers() {
    try {
        const res = await pool.query("SELECT email, role FROM users WHERE role IN ('STUDENT', 'TEACHER', 'STAFF', 'DRIVER') ORDER BY role");
        console.log('--- USERS FOUND ---');
        if (res.rows.length === 0) {
            console.log('No users found for these roles.');
        } else {
            res.rows.forEach(u => {
                console.log(`Role: ${u.role}, Email/ID: ${u.email}`);
            });
        }
        console.log('-------------------');
        console.log('Default password for strict testing usually: 123456');
    } catch (err) {
        console.error(err);
    } finally {
        await pool.end();
    }
}

checkUsers();
