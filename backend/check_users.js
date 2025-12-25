const fs = require('fs');
const { pool } = require('./src/config/db');

async function checkUsers() {
    try {
        const res = await pool.query('SELECT id, email, role, school_id FROM users');
        fs.writeFileSync('users_clean.json', JSON.stringify(res.rows, null, 2), 'utf8');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkUsers();
