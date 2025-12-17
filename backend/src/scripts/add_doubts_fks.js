const { pool } = require('../config/db');

async function addFKs() {
    const client = await pool.connect();
    try {
        // We wrap in try-catch blocks to avoid failing if constraint already exists (though create table was fresh)
        try {
            await client.query(`ALTER TABLE doubts ADD CONSTRAINT fk_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE;`);
            console.log("Added student FK");
        } catch (e) { console.log("Student FK might already exist or failed", e.message); }

        try {
            await client.query(`ALTER TABLE doubts ADD CONSTRAINT fk_teacher FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE SET NULL;`);
            console.log("Added teacher FK");
        } catch (e) { console.log("Teacher FK might already exist or failed", e.message); }

        try {
            await client.query(`ALTER TABLE doubts ADD CONSTRAINT fk_subject FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE SET NULL;`);
            console.log("Added subject FK");
        } catch (e) { console.log("Subject FK might already exist or failed", e.message); }

    } catch (err) {
        console.error("Error connecting or general error:", err);
    } finally {
        client.release();
        pool.end();
    }
}
addFKs();
