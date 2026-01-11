const { pool } = require('../config/db');
const fs = require('fs');

async function checkData() {
    const school_id = 1;
    const client = await pool.connect();
    try {
        const hRes = await client.query('SELECT TO_CHAR(holiday_date, \'YYYY-MM-DD\') as hdate, holiday_name FROM school_holidays WHERE school_id = $1 AND holiday_date >= \'2026-01-01\' AND holiday_date <= \'2026-01-31\' ORDER BY holiday_date', [school_id]);
        let output = 'SCHOOL HOLIDAYS JAN 2026:\n';
        hRes.rows.forEach(r => {
            output += `${r.hdate}: ${r.holiday_name}\n`;
        });
        fs.writeFileSync('holiday_check.txt', output);
        console.log('Written to holiday_check.txt');
    } catch (e) {
        console.error(e);
    } finally {
        client.release();
        process.exit(0);
    }
}

checkData();
