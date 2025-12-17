const { pool } = require('../config/db');

async function checkAnnouncementsSchemaDetails() {
    try {
        const client = await pool.connect();

        const text = `
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns
            WHERE table_name = 'announcements';
        `;

        const res = await client.query(text);
        console.log('--- Announcements Table Schema ---');
        console.log(JSON.stringify(res.rows, null, 2));

        client.release();
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

checkAnnouncementsSchemaDetails();
