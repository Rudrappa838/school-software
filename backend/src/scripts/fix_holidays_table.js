require('dotenv').config();
const { pool } = require('../config/db');

async function fixSchoolHolidaysTable() {
    const client = await pool.connect();
    try {
        console.log('=== FIXING SCHOOL_HOLIDAYS TABLE ===');

        // 1. Check table
        await client.query(`
            CREATE TABLE IF NOT EXISTS school_holidays (
                id SERIAL PRIMARY KEY,
                school_id INTEGER NOT NULL,
                holiday_date DATE NOT NULL,
                holiday_name VARCHAR(255) NOT NULL,
                is_paid BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // 2. Add Unique Constraint if not exists
        // We try to drop it first to be sure, then add it.
        try {
            await client.query(`
                ALTER TABLE school_holidays 
                DROP CONSTRAINT IF EXISTS unique_school_holiday;
            `);

            // Also drop any other unique constraint on these columns if we can find name, 
            // but standard way is often hard. 
            // Let's just try to add it. If data allows.

            // First, delete duplicates if any
            await client.query(`
                DELETE FROM school_holidays a USING school_holidays b
                WHERE a.id < b.id
                AND a.school_id = b.school_id
                AND a.holiday_date = b.holiday_date;
            `);

            await client.query(`
                ALTER TABLE school_holidays 
                ADD CONSTRAINT unique_school_holiday UNIQUE (school_id, holiday_date);
            `);
            console.log('✅ Unique constraint ensured.');

        } catch (e) {
            console.log('⚠️  Constraint issue (might already exist):', e.message);
        }

        console.log('Table structure verification complete.');

    } catch (error) {
        console.error('❌ Error fixing table:', error);
    } finally {
        client.release();
        process.exit(0);
    }
}

fixSchoolHolidaysTable();
