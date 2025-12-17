const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

async function debugLibrary() {
    try {
        console.log('--- Debugging Library Books ---');

        // 1. Find Student
        const studentRes = await pool.query("SELECT * FROM students WHERE email ILIKE 'rudru888%'");
        if (studentRes.rows.length === 0) {
            console.log('Student not found!');
            return;
        }
        const student = studentRes.rows[0];
        console.log('Student Found:', {
            id: student.id,
            name: student.name,
            admission_no: student.admission_no,
            attendance_id: student.attendance_id
        });

        // 2. Check Library Transactions
        console.log('\n--- All Issued Books in System ---');
        const transRes = await pool.query("SELECT * FROM library_transactions WHERE status = 'Issued'");
        transRes.rows.forEach(t => {
            console.log('Transaction:', {
                id: t.id,
                book_id: t.book_id,
                patron_type: t.patron_type,
                patron_id: t.patron_id, // This is the key field
                status: t.status
            });
        });

        // 3. Check Library Books
        const booksRes = await pool.query("SELECT id, title, book_number FROM library_books LIMIT 5");
        console.log('\n--- Books Available ---');
        console.log(JSON.stringify(booksRes.rows, null, 2));

    } catch (err) {
        console.error('DEBUG ERROR:', err);
    } finally {
        await pool.end();
    }
}

debugLibrary();
