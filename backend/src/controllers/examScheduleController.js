const { pool } = require('../config/db');

// Get Exam Schedule
exports.getExamSchedule = async (req, res) => {
    try {
        const school_id = req.user.schoolId;
        const { class_id, section_id, exam_type_id } = req.query;

        if (!exam_type_id && !class_id) {
            return res.status(400).json({ message: 'Exam Type or Class ID is required' });
        }

        let query = `
            SELECT es.*, sub.name as subject_name, c.name as class_name, s.name as section_name, et.name as exam_type_name
            FROM exam_schedules es
            JOIN subjects sub ON es.subject_id = sub.id
            JOIN classes c ON es.class_id = c.id
            LEFT JOIN sections s ON es.section_id = s.id
            JOIN exam_types et ON es.exam_type_id = et.id
            WHERE es.school_id = $1 
        `;

        const params = [school_id];
        let paramIndex = 2;

        if (exam_type_id) {
            query += ` AND es.exam_type_id = $${paramIndex}`;
            params.push(exam_type_id);
            paramIndex++;
        }

        if (class_id) {
            query += ` AND es.class_id = $${paramIndex}`;
            params.push(parseInt(class_id)); // Ensure integer
            paramIndex++;
        }

        if (section_id) {
            // Intelligent Section Filtering: Match specific section OR global class exams (NULL section)
            query += ` AND (es.section_id = $${paramIndex} OR es.section_id IS NULL)`;
            params.push(parseInt(section_id)); // Ensure integer
            paramIndex++;
        }

        query += ` ORDER BY es.exam_date, es.start_time`;

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

        if (!schedules || !Array.isArray(schedules) || schedules.length === 0) {
            return res.status(400).json({ message: 'No schedules provided' });
        }

        await client.query('BEGIN');

        if (delete_existing) {
            const keys = new Set(schedules.map(s => `${s.class_id}-${s.section_id || 'NULL'}-${s.exam_type_id}`));
            for (const key of keys) {
                const [cid, sid, eid] = key.split('-');
                const sectionId = sid === 'NULL' ? null : sid;

                let deleteQuery = `DELETE FROM exam_schedules WHERE school_id = $1 AND class_id = $2 AND exam_type_id = $4`;
                const params = [school_id, cid, sectionId, eid];

                if (sectionId) {
                    deleteQuery += ` AND section_id = $3`;
                } else {
                    deleteQuery += ` AND section_id IS NULL`;
                }

                await client.query(deleteQuery, params);
            }
        }

        for (const schedule of schedules) {
            await client.query(
                `INSERT INTO exam_schedules 
                 (school_id, exam_type_id, class_id, section_id, subject_id, exam_date, start_time, end_time, components, max_marks, min_marks)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
                [
                    school_id,
                    schedule.exam_type_id,
                    schedule.class_id,
                    schedule.section_id || null,
                    schedule.subject_id,
                    schedule.exam_date,
                    schedule.start_time,
                    schedule.end_time,
                    JSON.stringify(schedule.components || []),
                    schedule.max_marks || 100,
                    schedule.min_marks || 35
                ]
            );
        }

        await client.query('COMMIT');

        // Notification Logic (Simplified)
        try {
            const { sendPushNotification } = require('../services/notificationService');
            const combos = new Set(schedules.map(s => `${s.class_id}-${s.section_id || 'NULL'}`));
            for (const combo of combos) {
                const [cid, sid] = combo.split('-');
                let stuQuery = 'SELECT id FROM students WHERE school_id = $1 AND class_id = $2';
                const params = [school_id, cid];
                if (sid !== 'NULL') {
                    stuQuery += ' AND section_id = $3';
                    params.push(sid);
                }
                const studentsRes = await pool.query(stuQuery, params);
                for (const stu of studentsRes.rows) {
                    await sendPushNotification(stu.id, 'Exam Schedule', 'The exam schedule for your class has been updated.');
                }
            }
        } catch (notifyError) {
            console.error('Notification error:', notifyError);
        }

        res.json({ message: 'Exam schedule saved successfully' });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error saving exam schedule:', error);
        res.status(500).json({ message: 'Server error saving schedule' });
    } finally {
        client.release();
    }
};

// Update Single Exam Schedule Item
exports.updateExamScheduleItem = async (req, res) => {
    try {
        const { id } = req.params;
        const school_id = req.user.schoolId;
        const { exam_date, start_time, end_time, components, max_marks, min_marks, ids } = req.body;

        let result;

        if (ids && Array.isArray(ids) && ids.length > 0) {
            // Bulk update for grouped items
            result = await pool.query(
                `UPDATE exam_schedules 
                 SET exam_date = $1, start_time = $2, end_time = $3, components = $4, max_marks = $5, min_marks = $6
                 WHERE id = ANY($7) AND school_id = $8
                 RETURNING *`,
                [exam_date, start_time, end_time, JSON.stringify(components || []), max_marks || 100, min_marks || 35, ids, school_id]
            );
        } else {
            // Single update
            result = await pool.query(
                `UPDATE exam_schedules 
                 SET exam_date = $1, start_time = $2, end_time = $3, components = $4, max_marks = $5, min_marks = $6
                 WHERE id = $7 AND school_id = $8
                 RETURNING *`,
                [exam_date, start_time, end_time, JSON.stringify(components || []), max_marks || 100, min_marks || 35, id, school_id]
            );
        }

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Schedule item not found' });
        }

        res.json({ message: 'Schedule updated successfully', item: result.rows[0] });
    } catch (error) {
        console.error('Error updating schedule item:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
