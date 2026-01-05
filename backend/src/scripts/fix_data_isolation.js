const { pool } = require('../config/db');

async function fixDataIsolation() {
    try {
        console.log('--- Starting Data Isolation Cleanup ---');

        // 1. Hostels
        console.log('Fixing Hostels...');
        await pool.query("UPDATE hostels SET school_id = 1 WHERE school_id IS NULL");

        // 2. Library Books
        console.log('Fixing Library Books...');
        await pool.query("UPDATE library_books SET school_id = 1 WHERE school_id IS NULL");

        // 3. Events
        console.log('Fixing Events...');
        await pool.query("UPDATE events SET school_id = 1 WHERE school_id IS NULL");

        // 4. Announcements
        console.log('Fixing Announcements...');
        await pool.query("UPDATE announcements SET school_id = 1 WHERE school_id IS NULL");

        // 5. Leaves
        console.log('Fixing Leaves...');
        await pool.query("UPDATE leaves SET school_id = 1 WHERE school_id IS NULL");

        // 6. Transport Vehicles
        console.log('Fixing Vehicles...');
        await pool.query("UPDATE transport_vehicles SET school_id = 1 WHERE school_id IS NULL");

        // 7. Transport Routes
        console.log('Fixing Routes...');
        await pool.query("UPDATE transport_routes SET school_id = 1 WHERE school_id IS NULL");

        // 8. Fee Structures
        console.log('Fixing Fee Structures...');
        await pool.query("UPDATE fee_structures SET school_id = 1 WHERE school_id IS NULL");

        console.log('--- Cleanup Complete. All legacy data assigned to School ID 1. ---');
        process.exit(0);
    } catch (error) {
        console.error('Error during cleanup:', error);
        process.exit(1);
    }
}

fixDataIsolation();
