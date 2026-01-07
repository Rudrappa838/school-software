const { pool } = require('./src/config/db');

const migrate = async () => {
    try {
        await pool.query(`
            ALTER TABLE exam_schedules 
            ADD COLUMN IF NOT EXISTS max_marks INTEGER DEFAULT 100,
            ADD COLUMN IF NOT EXISTS min_marks INTEGER DEFAULT 35;
        `);
        console.log('Columns added to exam_schedules');
    } catch (e) {
        console.error(e);
    } finally {
        process.exit();
    }
};

migrate();
