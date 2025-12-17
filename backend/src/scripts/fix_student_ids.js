const { pool } = require('../config/db');

async function fixOldStudentIds() {
    const client = await pool.connect();
    try {
        console.log('🔄 Fixing old student IDs...');
        await client.query('BEGIN');

        // Fetch School Name for prefix
        const schoolRes = await client.query('SELECT id, name FROM schools LIMIT 1');
        const school = schoolRes.rows[0];

        if (!school) {
            console.log('❌ No school found.');
            return;
        }

        const prefix = school.name.replace(/[^a-zA-Z]/g, '').substring(0, 2).toUpperCase();
        console.log(`Using Prefix: ${prefix} for School: ${school.name}`);

        // Fetch students with bad format (containing '-')
        const students = await client.query("SELECT id, admission_no FROM students WHERE admission_no LIKE '%-%'");

        console.log(`Found ${students.rows.length} students with old IDs.`);

        for (const s of students.rows) {
            // Generate new ID: Prefix + Random 4 digits
            // To ensure uniqueness, we might loop, but for this script we assume random collision is low
            let newId;
            let exists = true;
            while (exists) {
                const rand4 = Math.floor(1000 + Math.random() * 9000);
                newId = `${prefix}${rand4}`;
                const check = await client.query('SELECT id FROM students WHERE admission_no = $1', [newId]);
                if (check.rows.length === 0) exists = false;
            }

            console.log(`✏️ Updating Student ${s.id}: ${s.admission_no} -> ${newId}`);

            await client.query(
                'UPDATE students SET admission_no = $1 WHERE id = $2',
                [newId, s.id]
            );
        }

        await client.query('COMMIT');
        console.log('✅ All student IDs updated successfully.');

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('❌ Error updating IDs:', error);
    } finally {
        client.release();
        pool.end();
    }
}

fixOldStudentIds();
