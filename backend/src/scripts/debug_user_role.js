const { pool } = require('../config/db');
async function run() {
    try {
        const res = await pool.query("SELECT email, role FROM users WHERE email='rudru888@gmail.com'");
        console.log(res.rows);
    } catch (e) { console.error(e); } finally { pool.end(); }
}
run();
