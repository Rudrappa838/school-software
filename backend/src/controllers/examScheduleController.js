const { pool } = require('../config/db');

// Get Exam Schedule
// Get Exam Schedule
exports.getExamSchedule = async (req, res) => {
    try {
        const school_id = req.user.schoolId;
        const { class_id, section_id, exam_type_id } = req.query;

        if (!exam_type_id) {
            return res.status(400).json({ message: 'Exam Type is required' });
        }

        let query = `
            SELECT es.*, sub.name as subject_name, c.name as class_name, s.name as section_name
            FROM exam_schedules es
            JOIN subjects sub ON es.subject_id = sub.id
            JOIN classes c ON es.class_id = c.id
            JOIN sections s ON es.section_id = s.id
            WHERE es.school_id = $1 
            AND es.exam_type_id = $2
        `;

        const params = [school_id, exam_type_id];
        let paramIndex = 3;

        if (class_id) {
            query += ` AND es.class_id = $${paramIndex}`;
            params.push(class_id);
            paramIndex++;
        }

        if (section_id) {
            query += ` AND es.section_id = $${paramIndex}`;
            params.push(section_id);
            paramIndex++;
        }

        query += ` ORDER BY Es.exam_date, es.start_time`;

        const result = await pool.query(query, params);

        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching exam schedule:', error);
        res.status(500).json({ message: 'Server error fetching schedule' });
    }
};

// Save Exam Schedule
exports.saveExamSchedule = async (req, res) => {
    const client = await pool.connect();
    try {
        const school_id = req.user.schoolId;
        const { schedules, delete_existing } = req.body;
        // schedules: Array of { class_id, section_id, exam_type_id, subject_id, exam_date, start_time, end_time }

        if (!schedules || !Array.isArray(schedules) || schedules.length === 0) {
            return res.status(400).json({ message: 'No schedules provided' });
        }

        await client.query('BEGIN');

        // Optional: Delete existing schedules for these classes/sections/exam before saving
        if (delete_existing) {
            const keys = new Set(schedules.map(s => `${s.class_id}-${s.section_id}-${s.exam_type_id}`));
            for (const key of keys) {
                const [cid, sid, eid] = key.split('-');
                await client.query(
                    `DELETE FROM exam_schedules 
                      WHERE school_id = $1 AND class_id = $2 AND section_id = $3 AND exam_type_id = $4`,
                    [school_id, cid, sid, eid]
                );
            }
        }

        for (const schedule of schedules) {
            await client.query(
                `INSERT INTO exam_schedules 
                 (school_id, exam_type_id, class_id, section_id, subject_id, exam_date, start_time, end_time)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
                [school_id, schedule.exam_type_id, schedule.class_id, schedule.section_id, schedule.subject_id, schedule.exam_date, schedule.start_time, schedule.end_time]
            );
        }

        await client.query('COMMIT');
        res.json({ message: 'Exam schedule saved successfully' });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error saving exam schedule:', error);
        res.status(500).json({ message: 'Server error saving schedule' });
    } finally {
        client.release();
    }
};
