const { pool } = require('../config/db');

async function verifyAllTables() {
    const client = await pool.connect();
    try {
        console.log("=== DATABASE HEALTH CHECK ===\n");

        // List of critical tables
        const criticalTables = [
            'schools', 'users', 'students', 'teachers', 'staff',
            'student_attendance', 'teacher_attendance', 'staff_attendance',
            'admissions_enquiries', 'salary_payments',
            'transport_routes', 'transport_vehicles',
            'library_books', 'hostel_rooms', 'hostel_allocations',
            'fee_structures', 'fee_payments',
            'announcements', 'leave_requests'
        ];

        for (const tableName of criticalTables) {
            const res = await client.query(`
                SELECT EXISTS (
                    SELECT FROM information_schema.tables 
                    WHERE table_schema = 'public' AND table_name = $1
                );
            `, [tableName]);

            const exists = res.rows[0].exists;
            const status = exists ? '✅' : '❌';
            console.log(`${status} ${tableName}`);
        }

        console.log("\n=== Route Files Check ===\n");
        const fs = require('fs');
        const path = require('path');
        const routesDir = path.join(__dirname, '../routes');

        const routeFiles = fs.readdirSync(routesDir).filter(f => f.endsWith('Routes.js'));
        routeFiles.forEach(file => {
            console.log(`✅ ${file}`);
        });

    } catch (e) {
        console.error("ERROR:", e);
    } finally {
        client.release();
        process.exit();
    }
}

verifyAllTables();
