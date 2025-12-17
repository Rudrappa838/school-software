const { pool } = require('../config/db');

const debugPatrons = async () => {
    try {
        console.log('--- STUDENTS (First 5) ---');
        const students = await pool.query('SELECT id, name, admission_no, attendance_id FROM students LIMIT 5');
        console.log(JSON.stringify(students.rows, null, 2));

        console.log('\n--- TEACHERS (First 5) ---');
        const teachers = await pool.query('SELECT id, name, employee_id FROM teachers LIMIT 5');
        console.log(JSON.stringify(teachers.rows, null, 2));

        console.log('\n--- STAFF (First 5) ---');
        const staff = await pool.query('SELECT id, name, employee_id FROM staff LIMIT 5');
        console.log(JSON.stringify(staff.rows, null, 2));

    } catch (err) {
        console.error(err);
    } finally {
        pool.end();
    }
};

debugPatrons();
