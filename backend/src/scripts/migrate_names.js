const { pool } = require('../config/db');

async function migrate() {
    try {
        await pool.query(`
            UPDATE students 
            SET first_name = split_part(name, ' ', 1), 
                last_name = substr(name, length(split_part(name, ' ', 1)) + 2)
            WHERE first_name IS NULL
        `);
        console.log('Migrated names');
    } catch (e) {
        console.error(e);
    } finally {
        pool.end();
    }
}
migrate();
