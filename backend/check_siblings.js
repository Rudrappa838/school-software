const { pool } = require('./src/config/db');

async function checkSiblings() {
    try {
        const query = `
            SELECT email, admission_no, first_name, last_name 
            FROM students 
            WHERE email IN (
                SELECT email 
                FROM students 
                GROUP BY email 
                HAVING COUNT(*) > 1
            ) 
            ORDER BY email, admission_no
        `;

        const res = await pool.query(query);

        console.log('\n=== Students with Same Email (Siblings) ===\n');
        if (res.rows.length === 0) {
            console.log('No siblings found with same email.');
        } else {
            console.table(res.rows);
        }

        await pool.end();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkSiblings();
