const { pool } = require('../config/db');

async function addSchoolCode() {
    const client = await pool.connect();
    try {
        console.log("Adding school_code column to schools table...\n");

        // Add school_code column
        await client.query(`
            ALTER TABLE schools 
            ADD COLUMN IF NOT EXISTS school_code VARCHAR(6) UNIQUE
        `);
        console.log("✅ Column added");

        // Generate codes for existing schools
        const schools = await client.query("SELECT id FROM schools WHERE school_code IS NULL");

        for (const school of schools.rows) {
            // Generate unique 6-digit code
            let code;
            let isUnique = false;

            while (!isUnique) {
                code = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit random
                const check = await client.query("SELECT id FROM schools WHERE school_code = $1", [code]);
                isUnique = check.rows.length === 0;
            }

            await client.query("UPDATE schools SET school_code = $1 WHERE id = $2", [code, school.id]);
            console.log(`School ID ${school.id} → Code: ${code}`);
        }

        console.log("\n✅ All schools now have unique 6-digit codes!");

    } catch (error) {
        console.error("ERROR:", error);
    } finally {
        client.release();
        process.exit();
    }
}

addSchoolCode();
