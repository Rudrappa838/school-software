const { pool } = require('../config/db');

async function debugFlow() {
    try {
        console.log('Fetching hostels...');
        const hostels = await pool.query('SELECT * FROM hostels');
        console.table(hostels.rows);

        if (hostels.rows.length > 0) {
            const id = hostels.rows[0].id;
            console.log(`Fetching allocations for hostel ${id}...`);
            const allocs = await pool.query(`
                SELECT a.*, s.first_name, s.last_name, r.room_number
                FROM hostel_allocations a
                JOIN hostel_rooms r ON a.room_id = r.id
                JOIN students s ON a.student_id = s.id
                WHERE r.hostel_id = $1 AND a.status = 'Active'
                ORDER BY r.room_number
            `, [id]);
            console.table(allocs.rows);
        } else {
            console.log('No hostels to test with.');
        }

        const cols = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'students'");
        // Only verify first_name/last_name presence
        const hasFirst = cols.rows.some(r => r.column_name === 'first_name');
        const hasLast = cols.rows.some(r => r.column_name === 'last_name');
        console.log(`Has first_name: ${hasFirst}, Has last_name: ${hasLast}`);

    } catch (e) {
        console.error(e);
    } finally {
        pool.end();
    }
}
debugFlow();
