const { pool } = require('../config/db');
async function run() {
    try {
        const res = await pool.query("SELECT * FROM hostel_allocations");
        console.log("Allocations:", res.rows);

        const res2 = await pool.query("SELECT * FROM students WHERE id = $1", [res.rows[0]?.student_id]);
        console.log("Student (from alloc):", res2.rows[0]?.first_name, res2.rows[0]?.email);

        const res3 = await pool.query("SELECT * FROM hostels");
        console.log("Hostels:", res3.rows);
    } catch (e) { console.error(e); } finally { pool.end(); }
}
run();
