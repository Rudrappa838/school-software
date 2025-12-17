const { pool } = require('../config/db');

async function debugStudentData() {
    try {
        const email = 'rudru888@gmail.com'; // The user causing issues
        console.log(`\n🔍 Debugging Data for: ${email}`);

        // 1. Check User
        const userRes = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
        if (userRes.rows.length === 0) {
            console.log('❌ User not found in users table!');
            return;
        }
        const user = userRes.rows[0];
        console.log(`✅ User Found: ID=${user.id}, Role=${user.role}, School=${user.school_id}`);

        // 2. Check Student Profile
        const studentRes = await pool.query(`SELECT * FROM students WHERE email = $1`, [email]);
        let student = null;

        if (studentRes.rows.length === 0) {
            console.log('❌ Student Profile not found by email!');
            // Try matching by admission no from email prefix?
            const prefix = email.split('@')[0];
            const studentByAdm = await pool.query(`SELECT * FROM students WHERE admission_no ILIKE $1`, [prefix]);
            if (studentByAdm.rows.length > 0) {
                student = studentByAdm.rows[0];
                console.log(`⚠️  Found student by Admission No (${prefix}): ID=${student.id}, Name=${student.name}`);
            } else {
                console.log('❌ No student found by Admission No either.');
            }
        } else {
            student = studentRes.rows[0];
            console.log(`✅ Student Profile Found: ID=${student.id}, Name=${student.name}, ClassID=${student.class_id}`);
        }

        if (!student) {
            console.log('🛑 STOP: Cannot check related data without a student profile.');
            return;
        }

        // 3. Check Attendance
        const attRes = await pool.query(`SELECT COUNT(*) as count FROM attendance WHERE student_id = $1`, [student.id]);
        console.log(`📊 Attendance Records: ${attRes.rows[0].count}`);

        // 4. Check Fees
        const feeRes = await pool.query(`SELECT COUNT(*) as count FROM fee_payments WHERE student_id = $1`, [student.id]);
        console.log(`💰 Fee Records: ${feeRes.rows[0].count}`);

        // 5. Check Library
        // Assuming table is 'library_transactions' or similar - let's check schema first or guess
        // I'll check 'library_issues' based on typical naming, or just skip if file not open.
        // Checking commonly used names from previous contexts
        // It seems 'library_transactions' or 'book_issues'. I'll check 'library_transactions'.
        try {
            const libRes = await pool.query(`SELECT COUNT(*) as count FROM library_transactions WHERE student_id = $1`, [student.id]);
            console.log(`📚 Library Records: ${libRes.rows[0].count}`);
        } catch (e) { console.log('❓ Library table check failed (might be different name)'); }

        // 6. Check Transport
        // Usually student has 'transport_route_id' in profile or a separate table
        console.log(`🚌 Transport Route ID: ${student.route_id || 'NULL'}`);

    } catch (err) {
        console.error(err);
    }
}

debugStudentData();
