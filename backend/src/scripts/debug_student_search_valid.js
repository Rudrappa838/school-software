const { pool } = require('../config/db');

async function debugStudentSearch() {
    // Search for ID '1' which definitely exists
    const searchTerm = '1';
    console.log(`Searching for student with term: "${searchTerm}"`);

    try {
        const client = await pool.connect();
        try {
            // Mimic the actual query in controller
            const query = `
            SELECT s.id, s.first_name, s.last_name, s.admission_no
            FROM students s
            WHERE s.admission_no ILIKE '%' || $1 || '%' 
               OR s.first_name ILIKE '%' || $1 || '%' 
               OR s.last_name ILIKE '%' || $1 || '%'
               OR CAST(s.id AS TEXT) = $1
            LIMIT 1
             `;

            const res = await client.query(query, [searchTerm]);
            console.log(`Found matches: ${res.rows.length}`);
            if (res.rows.length > 0) console.log(res.rows[0]);

        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        pool.end();
    }
}

debugStudentSearch();
