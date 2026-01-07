const { pool } = require('../config/db');
const fs = require('fs');

async function debugSchema() {
    try {
        const client = await pool.connect();
        let output = '';

        output += '--- Columns in exam_types ---\n';
        const res1 = await client.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'exam_types'
        `);
        output += JSON.stringify(res1.rows, null, 2) + '\n';

        output += '--- Columns in classes ---\n';
        const res2 = await client.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'classes'
        `);
        output += JSON.stringify(res2.rows, null, 2) + '\n';

        fs.writeFileSync('debug_output.txt', output);
        console.log('Done writing to debug_output.txt');

        client.release();
    } catch (err) {
        console.error('Error:', err);
    } finally {
        pool.end();
    }
}

debugSchema();
