const { pool } = require('../config/db');

async function debugHostelFetch() {
    const email = 'rudru888@gmail.com';
    const school_id = 1; // Assuming school_id is 1, need to verify

    console.log(`Debugging for email: ${email}`);

    try {
        // 1. Find Student ID and Admission No
        const studentRes = await pool.query(
            'SELECT id, admission_no, school_id FROM students WHERE LOWER(email) = LOWER($1)',
            [email]
        );

        if (studentRes.rows.length === 0) {
            console.log('Student NOT FOUND by email.');
            // Try by admission no part
            const emailParts = email.split('@');
            console.log(`Trying admission no: ${emailParts[0]}`);
            const studentRes2 = await pool.query(
                'SELECT id, admission_no, school_id FROM students WHERE LOWER(admission_no) = LOWER($1)',
                [emailParts[0]]
            );
            if (studentRes2.rows.length === 0) {
                console.log('Student NOT FOUND by admission no either.');
                return;
            } else {
                console.log('Found by admission no:', studentRes2.rows[0]);
            }
        } else {
            console.log('Found by email:', studentRes.rows[0]);
        }

        const student = studentRes.rows[0] || (await pool.query('SELECT * FROM students WHERE email = $1', [email])).rows[0];

        if (!student) return;

        // 2. Check Allocations
        console.log(`Checking allocations for student_id: ${student.id}`);
        const allocRes = await pool.query("SELECT * FROM hostel_allocations WHERE student_id = $1", [student.id]);
        console.log('Allocations:', allocRes.rows);

        // 3. Check Room
        if (allocRes.rows.length > 0) {
            const roomId = allocRes.rows[0].room_id;
            const roomRes = await pool.query("SELECT * FROM hostel_rooms WHERE id = $1", [roomId]);
            console.log('Room:', roomRes.rows[0]);
        }

        // 4. Run the huge query from controller
        const admissionNo = student.admission_no;
        console.log(`Running Main Query for Admission No: ${admissionNo}`);
        const result = await pool.query(`
            SELECT s.id, s.first_name, s.last_name, s.admission_no, 
                   s.parent_name, s.contact_number,
                   c.name as class_name, sec.name as section_name,
                   h.name as hostel_name, r.room_number, r.cost_per_term,
                   a.id as allocation_id, a.status as allocation_status
            FROM students s
            LEFT JOIN classes c ON s.class_id = c.id
            LEFT JOIN sections sec ON s.section_id = sec.id
            LEFT JOIN hostel_allocations a ON s.id = a.student_id AND a.status = 'Active'
            LEFT JOIN hostel_rooms r ON a.room_id = r.id
            LEFT JOIN hostels h ON r.hostel_id = h.id
            WHERE s.admission_no = $1
        `, [admissionNo]); // Removed school_id filter for broad check first

        console.log('Main Query Result:', result.rows[0]);


    } catch (e) {
        console.error(e);
    } finally {
        pool.end();
    }
}

debugHostelFetch();
