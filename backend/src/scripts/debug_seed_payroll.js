const { pool } = require('../config/db');

async function debugSeed() {
    try {
        const client = await pool.connect();

        // 1. Get Staff
        const s = await client.query("SELECT * FROM staff WHERE name ILIKE '%Rudrappa%'");
        if (s.rows.length === 0) { console.log("No staff"); process.exit(1); }
        const staff = s.rows[0];
        console.log("Staff ID:", staff.id, "School:", staff.school_id);

        // 2. Insert
        const q = `INSERT INTO salary_payments (school_id, staff_id, month, year, amount) VALUES ($1, $2, 11, 2024, 15000) RETURNING *`;
        const res = await client.query(q, [staff.school_id, staff.id]);
        console.log("Inserted:", res.rows[0]);

        client.release();
        process.exit();
    } catch (e) {
        console.log("ERROR:", e.message);
        process.exit(1);
    }
}

debugSeed();
