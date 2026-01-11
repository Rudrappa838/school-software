require('dotenv').config();
const { pool } = require('../config/db');

async function fixFestivalDate() {
    const client = await pool.connect();
    try {
        console.log('=== FIXING FESTIVAL DATES ===');

        const SCHOOL_ID = 1;

        // Fix Makara Sankranti: Move to Jan 14
        // Use 12:00:00 to ensure consistent timezone handling as per previous fixes
        const updateRes = await client.query(`
            UPDATE events 
            SET start_date = '2026-01-14 12:00:00', end_date = '2026-01-14 12:00:00'
            WHERE school_id = $1 
            AND title LIKE '%Makara Sankranti%'
            AND start_date >= '2026-01-01' AND start_date < '2026-02-01'
        `, [SCHOOL_ID]);

        console.log(`✅ Fixed Makara Sankranti: Updated ${updateRes.rowCount} events.`);

    } catch (error) {
        console.error('❌ Error fixing festival:', error);
    } finally {
        client.release();
        process.exit(0);
    }
}

fixFestivalDate();
