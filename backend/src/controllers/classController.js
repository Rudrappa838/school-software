const { pool } = require('../config/db');

exports.getAllClasses = async (req, res) => {
    try {
        const school_id = req.user.schoolId;
        const result = await pool.query(
            'SELECT * FROM classes WHERE school_id = $1 ORDER BY name',
            [school_id]
        );
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getSections = async (req, res) => {
    try {
        const { classId } = req.params;
        const result = await pool.query(
            'SELECT * FROM sections WHERE class_id = $1 ORDER BY name',
            [classId]
        );
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getSubjects = async (req, res) => {
    try {
        const { classId } = req.params;

        // Subjects are associated with Classes, not specific Sections
        const result = await pool.query(
            'SELECT * FROM subjects WHERE class_id = $1 ORDER BY id',
            [classId]
        );

        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

