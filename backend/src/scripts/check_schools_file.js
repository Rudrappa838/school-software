import { pool } from '../config/db.js';
import fs from 'fs';

const checkSchools = async () => {
    try {
        const res = await pool.query('SELECT * FROM schools');
        const output = JSON.stringify(res.rows, null, 2);
        fs.writeFileSync('schools_dump.txt', output);
        console.log("Dumped to schools_dump.txt");
    } catch (error) {
        console.error(error);
        fs.writeFileSync('schools_dump.txt', 'Error: ' + error.message);
    } finally {
        pool.end();
    }
};

checkSchools();
