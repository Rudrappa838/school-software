const { pool } = require('../config/db');

async function seedPayroll() {
    try {
        const client = await pool.connect();
        console.log("Seeding data...");

        const staffRes = await client.query("SELECT id FROM staff WHERE name ILIKE '%Rudrappa%' LIMIT 1");
        if (staffRes.rows.length === 0) {
            console.log("Rudrappa not found");
            process.exit(0);
        }

        const staffId = staffRes.rows[0].id;
        // Hardcode school_id from staff table check or just 1
        const schoolRes = await client.query("SELECT school_id FROM staff WHERE id = $1", [staffId]);
        const schoolId = schoolRes.rows[0].school_id;

        const today = new Date();
        for (let i = 1; i <= 3; i++) {
            const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
            const month = d.getMonth() + 1;
            const year = d.getFullYear();
            const amount = 15000 + (Math.random() * 1000);

            await client.query(`
                INSERT INTO salary_payments (school_id, staff_id, month, year, amount, status, remarks, payment_date)
                VALUES ($1, $2, $3, $4, $5, 'Paid', 'Salary Credited', $6)
                ON CONFLICT (staff_id, month, year) DO NOTHING
            `, [schoolId, staffId, month, year, amount.toFixed(2), d]);
            console.log(`Seeded ${month}/${year}`);
        }

        client.release();
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

seedPayroll();
