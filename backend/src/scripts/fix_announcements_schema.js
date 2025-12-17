const { pool } = require('../config/db');

async function fixAnnouncementsSchema() {
    try {
        const client = await pool.connect();

        // Check if created_by exists
        const res = await client.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'announcements' AND column_name = 'created_by'
        `);

        if (res.rows.length === 0) {
            console.log('Column created_by is MISSING. Adding it...');
            await client.query(`ALTER TABLE announcements ADD COLUMN created_by INTEGER REFERENCES users(id) ON DELETE SET NULL`);
            console.log('✅ Column created_by added.');
        } else {
            console.log('✅ Column created_by already exists.');
        }

        client.release();
        process.exit();
    } catch (error) {
        console.error('Error fixing schema:', error);
        process.exit(1);
    }
}

fixAnnouncementsSchema();
