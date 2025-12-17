const { pool } = require('../config/db');

async function debugUserTeacherLink() {
    const client = await pool.connect();
    try {
        console.log("--- All Users ---");
        const users = await client.query("SELECT id, email, role, school_id FROM users");
        console.log(JSON.stringify(users.rows, null, 2));

        console.log("\n--- All Teachers ---");
        const teachers = await client.query("SELECT id, email, school_id, name FROM teachers");
        console.log(JSON.stringify(teachers.rows, null, 2));

    } catch (err) {
        console.error(err);
    } finally {
        client.release();
        pool.end();
    }
}

debugUserTeacherLink();
