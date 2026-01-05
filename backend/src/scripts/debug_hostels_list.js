const { pool } = require('../config/db');

async function debugHostels() {
    try {
        console.log('--- Debugging Hostels Data ---');

        const res = await pool.query(`
            SELECT h.id, h.name, h.school_id, s.name as school_name 
            FROM hostels h 
            LEFT JOIN schools s ON h.school_id = s.id
        `);

        console.table(res.rows);

        console.log('\n--- Schools in DB ---');
        const schools = await pool.query('SELECT id, name FROM schools');
        console.table(schools.rows);

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

debugHostels();
