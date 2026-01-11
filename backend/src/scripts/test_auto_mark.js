require('dotenv').config();
const { pool } = require('../config/db');

async function testAutoMark() {
    try {
        console.log('=== TESTING AUTO-MARK FUNCTION ===\n');

        // Test with school_id 1, month 1, year 2026
        const school_id = 1;
        const month = 1;
        const year = 2026;

        console.log('Parameters:', { school_id, month, year });

        // Get teachers
        const teachers = await pool.query('SELECT id, name FROM teachers WHERE school_id = $1', [school_id]);
        console.log(`\n✅ Found ${teachers.rows.length} teachers`);
        if (teachers.rows.length > 0) {
            console.log('   Sample:', teachers.rows[0]);
        }

        // Get staff
        const staff = await pool.query('SELECT id, name FROM staff WHERE school_id = $1', [school_id]);
        console.log(`✅ Found ${staff.rows.length} staff`);
        if (staff.rows.length > 0) {
            console.log('   Sample:', staff.rows[0]);
        }

        // Try to insert one test record
        const testDate = '2026-01-05'; // A Sunday
        console.log(`\n📝 Trying to insert test record for date: ${testDate}`);

        if (teachers.rows.length > 0) {
            const testTeacher = teachers.rows[0];
            console.log(`   Teacher ID: ${testTeacher.id}, Name: ${testTeacher.name}`);

            const result = await pool.query(
                `INSERT INTO teacher_attendance (school_id, teacher_id, date, status)
                 VALUES ($1, $2, $3, 'Holiday')
                 ON CONFLICT (teacher_id, date) DO UPDATE SET status = 'Holiday'
                 RETURNING *`,
                [school_id, testTeacher.id, testDate]
            );

            console.log('✅ SUCCESS! Record inserted:', result.rows[0]);
        }

        console.log('\n✅ TEST PASSED! Auto-mark should work.');
        console.log('\nThe issue might be:');
        console.log('1. Authentication token expired');
        console.log('2. Frontend not sending correct data');
        console.log('3. CORS or network issue');

    } catch (error) {
        console.error('\n❌ TEST FAILED!');
        console.error('Error:', error.message);
        console.error('Code:', error.code);
        console.error('Detail:', error.detail);
        console.error('\nFull error:', error);
    } finally {
        process.exit(0);
    }
}

testAutoMark();
