require('dotenv').config();
const { pool } = require('../config/db');

async function checkTableStructure() {
    try {
        console.log('=== CHECKING TABLE STRUCTURE ===\n');

        // Check teacher_attendance table structure
        const tableInfo = await pool.query(`
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns
            WHERE table_name = 'teacher_attendance'
            ORDER BY ordinal_position;
        `);

        console.log('teacher_attendance columns:');
        tableInfo.rows.forEach(col => {
            console.log(`  - ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
        });

        // Check constraints
        const constraints = await pool.query(`
            SELECT constraint_name, constraint_type
            FROM information_schema.table_constraints
            WHERE table_name = 'teacher_attendance';
        `);

        console.log('\nConstraints:');
        constraints.rows.forEach(c => {
            console.log(`  - ${c.constraint_name}: ${c.constraint_type}`);
        });

        // Check if there are any foreign keys
        const fkeys = await pool.query(`
            SELECT
                tc.constraint_name,
                kcu.column_name,
                ccu.table_name AS foreign_table_name,
                ccu.column_name AS foreign_column_name
            FROM information_schema.table_constraints AS tc
            JOIN information_schema.key_column_usage AS kcu
              ON tc.constraint_name = kcu.constraint_name
            JOIN information_schema.constraint_column_usage AS ccu
              ON ccu.constraint_name = tc.constraint_name
            WHERE tc.table_name = 'teacher_attendance' AND tc.constraint_type = 'FOREIGN KEY';
        `);

        console.log('\nForeign Keys:');
        if (fkeys.rows.length === 0) {
            console.log('  No foreign keys found');
        } else {
            fkeys.rows.forEach(fk => {
                console.log(`  - ${fk.column_name} -> ${fk.foreign_table_name}.${fk.foreign_column_name}`);
            });
        }

    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        process.exit(0);
    }
}

checkTableStructure();
