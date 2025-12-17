const { pool } = require('../config/db');
const bcrypt = require('bcrypt');

async function verifyAllTestUsers() {
    const client = await pool.connect();
    try {
        console.log("=== VERIFYING TEST USERS ===\n");

        const password = '123456';
        const hashedPassword = await bcrypt.hash(password, 10);

        // Get school ID
        const schoolRes = await client.query("SELECT id FROM schools LIMIT 1");
        const schoolId = schoolRes.rows.length > 0 ? schoolRes.rows[0].id : null;

        if (!schoolId) {
            console.log("❌ No school found in database!");
            process.exit(1);
        }

        const testUsers = [
            { email: 'admin@demo.com', role: 'SCHOOL_ADMIN', name: 'School Admin' },
            { email: 'teacher@demo.com', role: 'TEACHER', name: 'Teacher' },
            { email: 'student@demo.com', role: 'STUDENT', name: 'Student' },
            { email: 'staff@demo.com', role: 'STAFF', name: 'Staff' },
            { email: 'mrudru7@gmail.com', role: 'STAFF', name: 'Rudrappa (Staff)' }
        ];

        for (const user of testUsers) {
            await client.query(`
                INSERT INTO users (email, password, role, school_id)
                VALUES ($1, $2, $3, $4)
                ON CONFLICT (email) 
                DO UPDATE SET password = $2, role = $3
            `, [user.email, hashedPassword, user.role, schoolId]);

            console.log(`✅ ${user.name}: ${user.email} (${user.role})`);
        }

        // Super Admin (no school_id)
        const superAdminPassword = await bcrypt.hash('admin123', 10);
        await client.query(`
            INSERT INTO users (email, password, role, school_id)
            VALUES ('superadmin@example.com', $1, 'SUPER_ADMIN', NULL)
            ON CONFLICT (email) 
            DO UPDATE SET password = $1, role = 'SUPER_ADMIN'
        `, [superAdminPassword]);

        console.log(`✅ Super Admin: superadmin@example.com (SUPER_ADMIN)`);

        console.log("\n=== ALL TEST USERS READY ===\n");
        console.log("Regular Login (/login):");
        console.log("  - admin@demo.com / 123456");
        console.log("  - teacher@demo.com / 123456");
        console.log("  - student@demo.com / 123456");
        console.log("  - staff@demo.com / 123456");
        console.log("  - mrudru7@gmail.com / 123456");
        console.log("\nSuper Admin Login (/super-admin-login):");
        console.log("  - superadmin@example.com / admin123\n");

    } catch (error) {
        console.error("ERROR:", error);
    } finally {
        client.release();
        process.exit();
    }
}

verifyAllTestUsers();
