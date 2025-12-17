const { pool } = require('../config/db');

async function debugUserTeacherLink() {
    const client = await pool.connect();
    try {
        console.log("--- Users (Role = TEACHER) ---");
        const users = await client.query("SELECT id, email, role, school_id FROM users WHERE role = 'TEACHER'");
        console.table(users.rows);

        console.log("\n--- Teachers Table ---");
        const teachers = await client.query("SELECT id, email, school_id, name FROM teachers");
        console.table(teachers.rows);

    } catch (err) {
        console.error(err);
    } finally {
        client.release();
        pool.end();
    }
}

debugUserTeacherLink();
