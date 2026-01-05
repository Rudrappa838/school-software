const { pool } = require('../config/db');

async function migrateHostels() {
    try {
        console.log('Running migration: Adding school_id to hostels table...');

        // Add school_id column
        await pool.query(`
            ALTER TABLE hostels 
            ADD COLUMN IF NOT EXISTS school_id INTEGER REFERENCES schools(id);
        `);

        // Optional: Update existing hostels to belong to school_id = 1 (if appropriate, or leave null)
        // Assuming typical single-tenant-turned-multi-tenant, putting everything in ID 1 is safer than NULL.
        await pool.query(`
            UPDATE hostels SET school_id = 1 WHERE school_id IS NULL;
        `);

        console.log('Migration successful: school_id added to hostels.');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrateHostels();
