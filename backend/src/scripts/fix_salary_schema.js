const { pool } = require('../config/db');

async function fixSalarySchema() {
    const client = await pool.connect();
    try {
        console.log("Dropping old salary_payments table...");
        await client.query("DROP TABLE IF EXISTS salary_payments CASCADE");

        console.log("Creating new generic salary_payments table...");
        await client.query(`
            CREATE TABLE salary_payments (
                id SERIAL PRIMARY KEY,
                school_id INTEGER NOT NULL,
                employee_id INTEGER NOT NULL,
                employee_type VARCHAR(20) NOT NULL, -- 'Teacher' or 'Staff'
                month INTEGER NOT NULL,
                year INTEGER NOT NULL,
                amount DECIMAL(10, 2) NOT NULL,
                payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                payment_mode VARCHAR(50) DEFAULT 'Cash', 
                status VARCHAR(20) DEFAULT 'Paid',
                transaction_ref VARCHAR(100),
                notes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT unique_salary_payment UNIQUE (school_id, employee_id, employee_type, month, year)
            );
        `);
        console.log("✅ Table created with generic schema.");

        // SEED DATA
        console.log("Seeding data...");

        // 1. Seed Rudrappa (Staff)
        const sRes = await client.query("SELECT id, school_id FROM staff WHERE name ILIKE '%Rudrappa%' LIMIT 1");
        if (sRes.rows.length > 0) {
            const { id, school_id } = sRes.rows[0];
            const months = [
                { m: 11, y: 2024, amt: 15500, mode: 'Bank Transfer' },
                { m: 10, y: 2024, amt: 15500, mode: 'Cash' }
            ];
            for (let rec of months) {
                await client.query(`
                    INSERT INTO salary_payments (school_id, employee_id, employee_type, month, year, amount, payment_mode, notes)
                    VALUES ($1, $2, 'Staff', $3, $4, $5, $6, 'Monthly Salary')
                `, [school_id, id, rec.m, rec.y, rec.amt, rec.mode]);
            }
            console.log("Seeded Rudrappa (Staff).");
        }

        // 2. Seed a dummy Teacher (if exists)
        const tRes = await client.query("SELECT id, school_id FROM teachers LIMIT 1");
        if (tRes.rows.length > 0) {
            const { id, school_id } = tRes.rows[0];
            await client.query(`
                INSERT INTO salary_payments (school_id, employee_id, employee_type, month, year, amount, payment_mode, notes)
                VALUES ($1, $2, 'Teacher', 11, 2024, 25000, 'Bank Transfer', 'Teacher Salary')
                ON CONFLICT DO NOTHING
            `, [school_id, id]);
            console.log("Seeded a Teacher.");
        }

    } catch (e) {
        console.error("ERROR:", e);
    } finally {
        client.release();
        process.exit();
    }
}

fixSalarySchema();
