const { pool } = require('../config/db');

async function debugStudentSearch() {
    const searchTerm = '255064';
    console.log(`Searching for student with term: "${searchTerm}"`);

    try {
        const client = await pool.connect();
        try {
            // Check for direct ID match
            const idMatch = await client.query('SELECT * FROM students WHERE id = $1', [parseInt(searchTerm) || 0]);
            console.log(`Match by ID (exact): ${idMatch.rows.length}`);
            if (idMatch.rows.length > 0) console.log(idMatch.rows[0]);

            // Check for Admission Number match
            const admissionMatch = await client.query('SELECT * FROM students WHERE admission_no = $1', [searchTerm]);
            console.log(`Match by Admission No (exact): ${admissionMatch.rows.length}`);
            if (admissionMatch.rows.length > 0) console.log(admissionMatch.rows[0]);

            // Check for ILIKE Admission Number
            const admissionLikeMatch = await client.query("SELECT * FROM students WHERE admission_no ILIKE '%' || $1 || '%'", [searchTerm]);
            console.log(`Match by Admission No (like): ${admissionLikeMatch.rows.length}`);
            if (admissionLikeMatch.rows.length > 0) console.log(admissionLikeMatch.rows[0]);

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
