import { pool } from '../config/db.js';
import fs from 'fs';

const checkUsers = async () => {
    try {
        const res = await pool.query('SELECT id, email, role, school_id FROM users');
        const output = JSON.stringify(res.rows, null, 2);
        fs.writeFileSync('users_dump.txt', output);
        console.log("Dumped to users_dump.txt");
    } catch (error) {
        console.error(error);
        fs.writeFileSync('users_dump.txt', 'Error: ' + error.message);
    } finally {
        pool.end();
    }
};

checkUsers();
