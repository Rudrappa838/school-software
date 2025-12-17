const { pool } = require('../config/db');
const fs = require('fs');
const logFile = 'debug_marks_output.txt';

function log(msg) {
    fs.appendFileSync(logFile, (typeof msg === 'object' ? JSON.stringify(msg, null, 2) : msg) + '\n');
}

async function debugMarks() {
    try {
        log('--- Checking Students Table Columns ---');
        const studentCols = await pool.query("SELECT * FROM students LIMIT 1");
        if (studentCols.rows.length > 0) {
            log(Object.keys(studentCols.rows[0]));
        } else {
            const schema = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'students'");
            log(schema.rows.map(r => r.column_name));
        }

        log('--- Exam Types ---');
        const examTypes = await pool.query("SELECT * FROM exam_types WHERE school_id = 1");
        log(examTypes.rows);

        if (examTypes.rows.length === 0) {
            log('No exam types found.');
            return;
        }

        const examTypeId = examTypes.rows[0].id;
        log(`Using Exam Type ID: ${examTypeId}`);

        log('--- Exam Components ---');
        const components = await pool.query("SELECT * FROM exam_components WHERE exam_type_id = $1", [examTypeId]);
        log(components.rows);

        log('--- Classes ---');
        const classes = await pool.query("SELECT * FROM classes WHERE school_id = 1");
        log(classes.rows);

        if (classes.rows.length === 0) return;
        const classId = classes.rows[0].id;

        log(`--- Sections for Class ${classId} ---`);
        const sections = await pool.query("SELECT * FROM sections WHERE class_id = $1", [classId]);
        log(sections.rows);

        if (sections.rows.length === 0) return;
        const sectionId = sections.rows[0].id;

        log(`--- Fetching Marks for Class ${classId}, Section ${sectionId} ---`);

        const result = await pool.query(
            `SELECT m.*, 
                    st.name as student_name,
                    st.roll_number
             FROM marks m
             JOIN students st ON m.student_id = st.id
             WHERE m.school_id = 1 AND m.class_id = $1 AND m.section_id = $2 AND m.exam_type_id = $3
             ORDER BY st.roll_number`,
            [classId, sectionId, examTypeId]
        );

        log(`Found ${result.rows.length} mark entries.`);

        for (const mark of result.rows) {
            log(`Mark ID: ${mark.id}, Student: ${mark.student_name}, Subject ID: ${mark.subject_id}, Marks: ${mark.marks_obtained}`);

            const componentsResult = await pool.query(
                `SELECT mc.*, ec.component_name
                 FROM mark_components mc
                 JOIN exam_components ec ON mc.component_id = ec.id
                 WHERE mc.mark_id = $1
                 ORDER BY ec.display_order`,
                [mark.id]
            );
            log('  Components:');
            log(componentsResult.rows);
        }

    } catch (error) {
        log('Error: ' + error);
    } finally {
        process.exit();
    }
}

debugMarks();