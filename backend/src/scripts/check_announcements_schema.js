const { pool } = require('../config/db');

async function checkAnnouncementsTable() {
    try {
        const client = await pool.connect();

        // Check if table exists
        const table = await client.query("SELECT to_regclass('public.announcements')");
        console.log('Table exists:', table.rows[0].to_regclass);

        if (table.rows[0].to_regclass) {
            // Check columns
            const columns = await client.query(`
                SELECT column_name, data_type 
                FROM information_schema.columns 
                WHERE table_name = 'announcements'
            `);
            console.log('Columns:', columns.rows);
        }

        client.release();
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

checkAnnouncementsTable();
