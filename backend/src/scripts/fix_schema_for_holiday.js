const { pool } = require('../config/db');

async function fixAttendanceSchema() {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        console.log('--- Updating Attendance Schema to allow "Holiday" status ---');

        // 1. Find the check constraint name (it might vary)
        const conQuery = await client.query(`
            SELECT conname 
            FROM pg_constraint 
            WHERE conrelid = 'attendance'::regclass 
            AND contype = 'c'
        `);

        for (const row of conQuery.rows) {
            console.log(`Dropping constraint: ${row.conname}`);
            await client.query(`ALTER TABLE attendance DROP CONSTRAINT ${row.conname}`);
        }

        // 2. Add new constraint with Holiday
        await client.query(`
            ALTER TABLE attendance ADD CONSTRAINT attendance_status_check 
            CHECK (status IN ('Present', 'Absent', 'Late', 'Leave', 'Half Day', 'Holiday', 'Unmarked'))
        `);
        console.log('✅ Added New Status Check Constraint with "Holiday"');

        await client.query('COMMIT');
        console.log('SUCCESS! Database schema updated.');
    } catch (e) {
        await client.query('ROLLBACK');
        console.error(e);
    } finally {
        client.release();
        process.exit(0);
    }
}

fixAttendanceSchema();
