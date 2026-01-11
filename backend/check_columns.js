const { pool } = require('./src/config/db');

async function checkColumns() {
    try {
        const tables = ['library_transactions', 'leave_requests', 'leaves', 'notifications', 'admissions_enquiries'];
        for (const table of tables) {
            const res = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name=$1 AND column_name='student_id'", [table]);
            if (res.rows.length > 0) {
                console.log(`Table ${table} HAS student_id`);
            }
        }
    } catch (err) {
        console.error(err);
    } finally {
        pool.end();
    }
}

checkColumns();
