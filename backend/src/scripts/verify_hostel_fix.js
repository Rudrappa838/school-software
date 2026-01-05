const { pool } = require('../config/db');

async function checkHostels() {
    try {
        console.log('CHECKING HOSTELS TABLE DATA:');
        const res = await pool.query(`
            SELECT id, name, school_id FROM hostels
        `);
        console.log(JSON.stringify(res.rows, null, 2));

        console.log('\nCHECKING IF FIX IS EFFECTIVE:');
        if (res.rows.length > 0 && res.rows.some(h => h.school_id === null)) {
            console.log('WARNING: Some hostels still have NULL school_id. Visibility issues may persist.');
        } else {
            console.log('SUCCESS: All hostels have a school_id.');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkHostels();
