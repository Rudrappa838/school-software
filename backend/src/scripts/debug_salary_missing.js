const { pool } = require('../config/db');

async function debugSalaryMissing() {
    const client = await pool.connect();
    try {
        console.log("DEBUG_START");
        // 1. Find Rudrappa
        const staffRes = await client.query("SELECT id, email, name FROM staff WHERE name ILIKE '%Rudrappa%'");
        if (staffRes.rows.length === 0) {
            console.log("User not found");
        } else {
            const staff = staffRes.rows[0];
            console.log("User:", JSON.stringify(staff));

            // 2. Check Records
            const salaryRes = await client.query("SELECT * FROM salary_payments WHERE staff_id = $1", [staff.id]);
            console.log("SalaryRecords:", JSON.stringify(salaryRes.rows));

            if (salaryRes.rows.length === 0) {
                // Check if any records exist at all
                const all = await client.query("SELECT * FROM salary_payments LIMIT 5");
                console.log("SampleData:", JSON.stringify(all.rows));
            }
        }
        console.log("DEBUG_END");

    } catch (e) {
        console.log("ERROR:", e.message);
    } finally {
        client.release();
        process.exit();
    }
}

debugSalaryMissing();
