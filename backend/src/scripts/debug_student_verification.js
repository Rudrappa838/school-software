const { pool } = require('../config/db');

async function debugVerification() {
    try {
        console.log('--- Students Data ---');
        const students = await pool.query('SELECT id, admission_no, first_name, last_name, class_id, section_id FROM students LIMIT 10');
        console.table(students.rows);

        if (students.rows.length === 0) {
            console.log('No students found in DB.');
            return;
        }

        const testAdmNo = students.rows[0].admission_no;
        console.log(`\n--- Testing Verification for Admission No: '${testAdmNo}' ---`);

        const query = `
            SELECT s.id, s.first_name, s.last_name, s.admission_no, 
                   s.parent_name, s.contact_number,
                   c.name as class_name, sec.name as section_name,
                   h.name as hostel_name, r.room_number, r.cost_per_term,
                   a.id as allocation_id
            FROM students s
            LEFT JOIN classes c ON s.class_id = c.id
            LEFT JOIN sections sec ON s.section_id = sec.id
            LEFT JOIN hostel_allocations a ON s.id = a.student_id AND a.status = 'Active'
            LEFT JOIN hostel_rooms r ON a.room_id = r.id
            LEFT JOIN hostels h ON r.hostel_id = h.id
            WHERE s.admission_no = $1
        `;

        const res = await pool.query(query, [testAdmNo]);
        console.log('Result found:', res.rows.length > 0);
        if (res.rows.length > 0) {
            console.log(res.rows[0]);
        } else {
            console.log('Query returned no rows.');
        }

    } catch (e) {
        console.error(e);
    } finally {
        pool.end();
    }
}

debugVerification();
