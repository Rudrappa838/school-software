const { pool } = require('./src/config/db');

async function checkData() {
    try {
        const client = await pool.connect();

        console.log('--- Checking Exam Types ---');
        const exams = await client.query('SELECT * FROM exam_types');
        console.table(exams.rows);

        if (exams.rows.length > 0) {
            console.log('\n--- Checking Exam Components ---');
            const components = await client.query('SELECT * FROM exam_components');
            console.table(components.rows);
        }

        console.log('\n--- Checking Marks Table (Last 5) ---');
        const marks = await client.query('SELECT * FROM marks ORDER BY updated_at DESC LIMIT 5');
        console.table(marks.rows);

        if (marks.rows.length > 0) {
            console.log('\n--- Checking Mark Components (Last 5) ---');
            const markComponents = await client.query('SELECT * FROM mark_components ORDER BY created_at DESC LIMIT 5');
            console.table(markComponents.rows);
        }

        client.release();
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkData();
