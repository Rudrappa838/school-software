const { pool } = require('../config/db');

// Get or Create Exam Types
exports.getExamTypes = async (req, res) => {
    try {
        const school_id = req.user.schoolId;

        // Get exam types
        const examTypesResult = await pool.query(
            `SELECT * FROM exam_types WHERE school_id = $1 ORDER BY name`,
            [school_id]
        );

        // Get components for each exam type
        const examTypes = await Promise.all(examTypesResult.rows.map(async (examType) => {
            const componentsResult = await pool.query(
                `SELECT * FROM exam_components WHERE exam_type_id = $1 ORDER BY display_order`,
                [examType.id]
            );
            return {
                ...examType,
                components: componentsResult.rows
            };
        }));

        res.json(examTypes);
    } catch (error) {
        console.error('Error fetching exam types:', error);
        res.status(500).json({ message: 'Server error fetching exam types' });
    }
};

exports.createExamType = async (req, res) => {
    const client = await pool.connect();
    try {
        const school_id = req.user.schoolId;
        const { name, max_marks, weightage, components } = req.body;

        await client.query('BEGIN');

        const result = await client.query(
            `INSERT INTO exam_types (school_id, name, max_marks, weightage)
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [school_id, name, max_marks, weightage || 0]
        );

        const examType = result.rows[0];

        // If components are provided, insert them
        if (components && Array.isArray(components) && components.length > 0) {
            for (let i = 0; i < components.length; i++) {
                const component = components[i];
                await client.query(
                    `INSERT INTO exam_components (exam_type_id, component_name, max_marks, display_order)
                     VALUES ($1, $2, $3, $4)`,
                    [examType.id, component.name, component.max_marks, i + 1]
                );
            }
        }

        await client.query('COMMIT');
        res.status(201).json(examType);
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error creating exam type:', error);
        res.status(500).json({ message: 'Server error creating exam type' });
    } finally {
        client.release();
    }
};

// Get Marks for a Class/Section/Exam
exports.getMarks = async (req, res) => {
    try {
        const school_id = req.user.schoolId;
        const { class_id, section_id, exam_type_id } = req.query;

        if (!class_id || !section_id || !exam_type_id) {
            return res.status(400).json({ message: 'Class, Section, and Exam Type are required' });
        }

        const result = await pool.query(
            `SELECT m.*, 
                    st.name as student_name,
                    st.admission_no as admission_number,
                    st.roll_number,
                    sub.name as subject_name,
                    et.name as exam_name,
                    et.max_marks
             FROM marks m
             JOIN students st ON m.student_id = st.id
             LEFT JOIN subjects sub ON m.subject_id = sub.id
             JOIN exam_types et ON m.exam_type_id = et.id
             WHERE m.school_id = $1 AND m.class_id = $2 AND m.section_id = $3 AND m.exam_type_id = $4
             ORDER BY st.roll_number, sub.name`,
            [school_id, class_id, section_id, exam_type_id]
        );

        // If no marks found, return empty array
        if (!result.rows || result.rows.length === 0) {
            console.log('No marks found for:', { class_id, section_id, exam_type_id });
            return res.json([]);
        }

        // Fetch component marks for each mark
        const marksWithComponents = await Promise.all(result.rows.map(async (mark) => {
            try {
                const componentsResult = await pool.query(
                    `SELECT mc.*, ec.component_name, ec.max_marks as component_max_marks
                     FROM mark_components mc
                     JOIN exam_components ec ON mc.component_id = ec.id
                     WHERE mc.mark_id = $1
                     ORDER BY ec.display_order`,
                    [mark.id]
                );
                return {
                    ...mark,
                    components: componentsResult.rows || []
                };
            } catch (compError) {
                console.error('Error fetching components for mark:', mark.id, compError);
                return {
                    ...mark,
                    components: []
                };
            }
        }));

        res.json(marksWithComponents);
    } catch (error) {
        console.error('Error fetching marks:', error);
        console.error('Error details:', error.message);
        console.error('Stack:', error.stack);
        res.status(500).json({ message: 'Server error fetching marks', error: error.message });
    }
};

// Get Marksheet for a Single Student
// Get Marksheet for a Single Student
exports.getStudentMarksheet = async (req, res) => {
    try {
        const school_id = req.user.schoolId;
        let { student_id, exam_type_id } = req.query;

        // If user is STUDENT, force student_id to match their profile
        if (req.user.role === 'STUDENT') {
            const { email } = req.user;
            // Lookup Student ID from Email
            let studentRes = await pool.query(
                'SELECT id FROM students WHERE school_id = $1 AND LOWER(email) = LOWER($2)',
                [school_id, email]
            );

            if (studentRes.rows.length === 0) {
                const emailParts = email.split('@');
                if (emailParts.length === 2) {
                    studentRes = await pool.query(
                        'SELECT id FROM students WHERE school_id = $1 AND LOWER(admission_no) = LOWER($2)',
                        [school_id, emailParts[0]]
                    );
                }
            }

            if (studentRes.rows.length === 0) {
                return res.status(404).json({ message: 'Student profile not linked to user' });
            }
            student_id = studentRes.rows[0].id;
        }

        if (!student_id || !exam_type_id) {
            return res.status(400).json({ message: 'Student and Exam Type are required' });
        }

        // Get student details
        const studentResult = await pool.query(
            `SELECT st.*, c.name as class_name, sec.name as section_name
             FROM students st
             LEFT JOIN classes c ON st.class_id = c.id
             LEFT JOIN sections sec ON st.section_id = sec.id
             WHERE st.id = $1 AND st.school_id = $2`,
            [student_id, school_id]
        );

        if (studentResult.rows.length === 0) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const student = studentResult.rows[0];

        // Get marks for all subjects
        const marksResult = await pool.query(
            `SELECT m.*, 
                    sub.name as subject_name,
                    et.name as exam_name,
                    et.max_marks
             FROM marks m
             JOIN subjects sub ON m.subject_id = sub.id
             JOIN exam_types et ON m.exam_type_id = et.id
             WHERE m.student_id = $1 AND m.exam_type_id = $2 AND m.school_id = $3
             ORDER BY sub.name`,
            [student_id, exam_type_id, school_id]
        );

        const totalMarks = marksResult.rows.reduce((sum, m) => sum + parseFloat(m.marks_obtained || 0), 0);
        const maxMarks = marksResult.rows.reduce((sum, m) => sum + parseFloat(m.max_marks || 0), 0);
        const percentage = maxMarks > 0 ? ((totalMarks / maxMarks) * 100).toFixed(2) : 0;

        res.json({
            student,
            marks: marksResult.rows,
            summary: {
                total_marks: totalMarks,
                max_marks: maxMarks,
                percentage
            }
        });
    } catch (error) {
        console.error('Error fetching student marksheet:', error);
        res.status(500).json({ message: 'Server error fetching marksheet' });
    }
};

// Save/Update Marks (Bulk)
exports.saveMarks = async (req, res) => {
    const client = await pool.connect();
    try {
        const school_id = req.user.schoolId;
        const { marks } = req.body;

        if (!marks || !Array.isArray(marks) || marks.length === 0) {
            return res.status(400).json({ message: 'Marks data is required' });
        }

        console.log('Received marks to save:', marks.length);
        if (marks.length > 0) {
            console.log('Sample mark:', marks[0]);
            console.log('Has component_id?', marks[0].component_id);
        }

        await client.query('BEGIN');

        for (const mark of marks) {
            if (mark.component_id) {
                // Component-based mark
                // First, ensure the main mark entry exists
                const mainMarkResult = await client.query(
                    `INSERT INTO marks 
                     (school_id, student_id, class_id, section_id, subject_id, exam_type_id, marks_obtained, updated_at)
                     VALUES ($1, $2, $3, $4, $5, $6, 0, CURRENT_TIMESTAMP)
                     ON CONFLICT (school_id, student_id, subject_id, exam_type_id)
                     DO UPDATE SET updated_at = CURRENT_TIMESTAMP
                     RETURNING id`,
                    [school_id, mark.student_id, mark.class_id, mark.section_id,
                        mark.subject_id, mark.exam_type_id]
                );

                const markId = mainMarkResult.rows[0].id;

                // Insert/update component mark
                await client.query(
                    `INSERT INTO mark_components (mark_id, component_id, marks_obtained)
                     VALUES ($1, $2, $3)
                     ON CONFLICT (mark_id, component_id)
                     DO UPDATE SET marks_obtained = EXCLUDED.marks_obtained`,
                    [markId, mark.component_id, mark.marks_obtained]
                );

                // Update total marks on main entry
                const totalResult = await client.query(
                    `SELECT COALESCE(SUM(marks_obtained), 0) as total 
                     FROM mark_components 
                     WHERE mark_id = $1`,
                    [markId]
                );

                await client.query(
                    `UPDATE marks SET marks_obtained = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`,
                    [totalResult.rows[0].total, markId]
                );
            } else {
                // Simple mark (no components)
                await client.query(
                    `INSERT INTO marks 
                     (school_id, student_id, class_id, section_id, subject_id, exam_type_id, marks_obtained, remarks, updated_at)
                     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP)
                     ON CONFLICT (school_id, student_id, subject_id, exam_type_id)
                     DO UPDATE SET 
                        marks_obtained = EXCLUDED.marks_obtained,
                        remarks = EXCLUDED.remarks,
                        updated_at = CURRENT_TIMESTAMP`,
                    [school_id, mark.student_id, mark.class_id, mark.section_id,
                        mark.subject_id, mark.exam_type_id, mark.marks_obtained, mark.remarks || null]
                );
            }
        }

        await client.query('COMMIT');

        // Notification Logic
        const { sendPushNotification } = require('../services/notificationService');
        const uniqueStudentIds = [...new Set(marks.map(m => m.student_id))];
        for (const studentId of uniqueStudentIds) {
            // We could fetch exam name here for better context, but generic is fine for now
            await sendPushNotification(studentId, 'Exam Results', 'New marks have been updated in your report card.');
        }
        res.json({ message: 'Marks saved successfully', count: marks.length });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error saving marks:', error);
        res.status(500).json({ message: 'Server error saving marks' });
    } finally {
        client.release();
    }
};

// Get My Marks (Student View)
exports.getMyMarks = async (req, res) => {
    try {
        const { id, role, email, schoolId, linkedId } = req.user;
        let student_id = linkedId;

        if (role !== 'STUDENT') {
            return res.status(403).json({ message: 'Only students can access this route' });
        }

        // Fallback Logic
        if (!student_id) {
            const studentRes = await pool.query(
                'SELECT id FROM students WHERE school_id = $1 AND LOWER(email) = LOWER($2)',
                [schoolId, email]
            );
            if (studentRes.rows.length > 0) student_id = studentRes.rows[0].id;
            else {
                const prefix = email.split('@')[0];
                const s2 = await pool.query('SELECT id FROM students WHERE admission_no = $1', [prefix]);
                if (s2.rows.length > 0) student_id = s2.rows[0].id;
            }
        }

        if (!student_id) return res.status(404).json({ message: 'Student profile not found' });

        // 1. Fetch Marks
        // We want all marks across all exams
        const { month, year } = req.query; // Added filtering params

        let marksQuery = `
            SELECT m.marks_obtained as marks, 
                   st.max_marks as "totalMarks",
                   sub.name as subject,
                   et.name as "examType",
                   m.remarks,
                   CASE 
                     WHEN (m.marks_obtained / st.max_marks) >= 0.9 THEN 'A+'
                     WHEN (m.marks_obtained / st.max_marks) >= 0.8 THEN 'A'
                     WHEN (m.marks_obtained / st.max_marks) >= 0.7 THEN 'B'
                     ELSE 'C'
                   END as grade
            FROM marks m
            JOIN subjects sub ON m.subject_id = sub.id
            JOIN exam_types et ON m.exam_type_id = et.id
            CROSS JOIN LATERAL (SELECT et.max_marks) as st
            WHERE m.student_id = $1
        `;

        const queryParams = [student_id];

        if (month && year) {
            marksQuery += ` AND EXTRACT(MONTH FROM m.created_at) = $2 AND EXTRACT(YEAR FROM m.created_at) = $3`;
            queryParams.push(month, year);
        }

        marksQuery += ` ORDER BY m.updated_at DESC`;

        const marksRes = await pool.query(marksQuery, queryParams);

        // 2. Fetch Upcoming Exams (Mock or Real)
        // Check exam schedule if exists, otherwise return mock

        const exams = [
            { id: 1, examName: 'Final Exam', subject: 'Mathematics', date: '2025-05-10', time: '10:00 AM' },
            { id: 2, examName: 'Final Exam', subject: 'Science', date: '2025-05-12', time: '10:00 AM' }
        ];

        res.json({
            marks: marksRes.rows,
            upcomingExams: exams
        });

    } catch (error) {
        console.error('Error fetching my marks:', error);
        res.status(500).json({ message: 'Server error fetching marks' });
    }
};

exports.getAllMarksheets = async (req, res) => {
    try {
        const school_id = req.user.schoolId;
        const { class_id, section_id, exam_type_id } = req.query;

        if (!class_id || !section_id || !exam_type_id) {
            return res.status(400).json({ message: 'Class, Section, and Exam Type are required' });
        }

        // Get all students in this class/section
        const studentsResult = await pool.query(
            `SELECT st.*, c.name as class_name, sec.name as section_name
             FROM students st
             JOIN classes c ON st.class_id = c.id
             JOIN sections sec ON st.section_id = sec.id
             WHERE st.class_id = $1 AND st.section_id = $2 AND st.school_id = $3
             ORDER BY st.roll_number`,
            [class_id, section_id, school_id]
        );

        const marksheets = [];

        for (const student of studentsResult.rows) {
            const marksResult = await pool.query(
                `SELECT m.*, 
                        sub.name as subject_name,
                        et.name as exam_name,
                        et.max_marks
                 FROM marks m
                 JOIN subjects sub ON m.subject_id = sub.id
                 JOIN exam_types et ON m.exam_type_id = et.id
                 WHERE m.student_id = $1 AND m.exam_type_id = $2 AND m.school_id = $3
                 ORDER BY sub.name`,
                [student.id, exam_type_id, school_id]
            );

            const totalMarks = marksResult.rows.reduce((sum, m) => sum + parseFloat(m.marks_obtained || 0), 0);
            const maxMarks = marksResult.rows.reduce((sum, m) => sum + parseFloat(m.max_marks || 0), 0);
            const percentage = maxMarks > 0 ? ((totalMarks / maxMarks) * 100).toFixed(2) : 0;

            marksheets.push({
                student,
                marks: marksResult.rows,
                summary: {
                    total_marks: totalMarks,
                    max_marks: maxMarks,
                    percentage
                }
            });
        }

        res.json(marksheets);
    } catch (error) {
        console.error('Error fetching all marksheets:', error);
        res.status(500).json({ message: 'Server error fetching marksheets' });
    }
};
