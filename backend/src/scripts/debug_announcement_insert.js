const { pool } = require('../config/db');

async function debugAnnouncement() {
    try {
        const client = await pool.connect();

        // 1. Get a school admin
        const adminRes = await client.query("SELECT id, school_id FROM users WHERE role = 'SCHOOL_ADMIN' OR role = 'SUPER_ADMIN' LIMIT 1");
        if (adminRes.rows.length === 0) {
            console.log('No admin found to test with.');
            process.exit(0);
        }
        const admin = adminRes.rows[0];
        console.log('Testing with Admin ID:', admin.id, 'School ID:', admin.school_id);

        // 2. Try INsert
        console.log('Attempting insert with NULL valid_until...');
        try {
            const res = await client.query(`
                INSERT INTO announcements (school_id, title, message, target_role, priority, valid_until, created_by)
                VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *
            `, [admin.school_id, 'Test Title', 'Test Message', 'Student', 'Normal', null, admin.id]);
            console.log('Insert Success:', res.rows[0]);
        } catch (e) {
            console.error('Insert Failed (NULL valid_until):', e.message);
        }

        console.log('Attempting insert with empty string valid_until (Simulate frontend buffer)...');
        // Note: Frontend sends null if empty, but let's see if accidental empty string breaks it if logic fails
        try {
            const res = await client.query(`
                INSERT INTO announcements (school_id, title, message, target_role, priority, valid_until, created_by)
                VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *
            `, [admin.school_id, 'Test Title 2', 'Test Message 2', 'Student', 'Normal', '', admin.id]);
            // This SHOULD fail for timestamp column
            console.log('Insert Success (Empty String):', res.rows[0]);
        } catch (e) {
            console.log('Insert Failed (Empty String) - AS EXPECTED:', e.message);
        }

        client.release();
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

debugAnnouncement();
