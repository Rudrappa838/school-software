import { pool } from '../config/db.js';

const checkSchema = async () => {
    try {
        const tables = ['students', 'teachers', 'staff'];
        for (const table of tables) {
            const res = await pool.query(`
                SELECT column_name, data_type 
                FROM information_schema.columns 
                WHERE table_name = '${table}';
            `);
            console.log(`\nColumns for ${table}:`);
            res.rows.forEach(row => console.log(`- ${row.column_name} (${row.data_type})`));
        }
    } catch (error) {
        console.error(error);
    }
};

checkSchema();
