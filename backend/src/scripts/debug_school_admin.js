const { pool } = require('../config/db');

async function debugSchoolAdmin() {
    const client = await pool.connect();
    try {
        console.log("--- Users with SCHOOL_ADMIN role ---");
        const res = await client.query("SELECT id, email, role, school_id FROM users WHERE role = 'SCHOOL_ADMIN'");
        console.log(res.rows);

        if (res.rows.length > 0) {
            const admin = res.rows[0];
            console.log(`Checking School with ID: ${admin.school_id}`);

            const sRes = await client.query("SELECT * FROM schools WHERE id = $1", [admin.school_id]);
            console.log("School Record:", sRes.rows[0]);

            if (sRes.rows.length > 0) {
                // Check classes/sections query from controller
                console.log("Testing Classes Query...");
                const classesRes = await client.query(`
                    SELECT 
                        c.id as class_id, c.name as class_name,
                        json_agg(DISTINCT jsonb_build_object('id', s.id, 'name', s.name)) FILTER (WHERE s.id IS NOT NULL) as sections,
                        json_agg(DISTINCT jsonb_build_object('id', sub.id, 'name', sub.name)) FILTER (WHERE sub.id IS NOT NULL) as subjects
                    FROM classes c
                    LEFT JOIN sections s ON c.id = s.class_id
                    LEFT JOIN subjects sub ON c.id = sub.class_id
                    WHERE c.school_id = $1
                    GROUP BY c.id, c.name
                `, [admin.school_id]);
                console.log(`Found ${classesRes.rows.length} classes.`);
            }
        } else {
            console.log("No SCHOOL_ADMIN found.");
        }

    } catch (err) {
        console.error(err);
    } finally {
        client.release();
        pool.end();
    }
}

debugSchoolAdmin();
