const { pool } = require('../config/db');

// Events
// Events
exports.getEvents = async (req, res) => {
    try {
        const school_id = req.user.schoolId;
        const role = req.user.role;

        let query = `SELECT * FROM events WHERE school_id = $1`;
        const params = [school_id];

        if (role !== 'SCHOOL_ADMIN' && role !== 'SUPER_ADMIN') {
            let audienceRole = '';
            if (role === 'STUDENT') audienceRole = 'Students';
            else if (role === 'TEACHER') audienceRole = 'Teachers';
            else if (['STAFF', 'DRIVER', 'TRANSPORT_MANAGER'].includes(role)) audienceRole = 'Staff';

            query += ` AND (audience = 'All' OR audience = $2)`;
            params.push(audienceRole);
        }

        query += ` ORDER BY start_date ASC`;

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.addEvent = async (req, res) => {
    try {
        const school_id = req.user.schoolId;
        const { title, event_type, start_date, end_date, description, audience } = req.body;

        const result = await pool.query(
            `INSERT INTO events (school_id, title, event_type, start_date, end_date, description, audience)
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [school_id, title, event_type, start_date, end_date, description, audience]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteEvent = async (req, res) => {
    try {
        await pool.query('DELETE FROM events WHERE id = $1 AND school_id = $2', [req.params.id, req.user.schoolId]);
        res.json({ message: 'Event deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Announcements
exports.getAnnouncements = async (req, res) => {
    try {
        const school_id = req.user.schoolId;
        const role = req.user.role;

        let query = `SELECT * FROM announcements WHERE school_id = $1`;
        const params = [school_id];

        if (role !== 'SCHOOL_ADMIN' && role !== 'SUPER_ADMIN') {
            let target = 'All';
            if (role === 'STUDENT') target = 'Student';
            else if (role === 'TEACHER') target = 'Teacher';
            else if (['STAFF', 'DRIVER', 'TRANSPORT_MANAGER'].includes(role)) target = 'Staff';

            query += ` AND (target_role = 'All' OR target_role = $2)`;
            params.push(target);
        }

        query += ` ORDER BY created_at DESC`;

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const fs = require('fs');
const path = require('path');

exports.addAnnouncement = async (req, res) => {
    try {
        const school_id = req.user.schoolId;
        const { title, message, target_role, priority, valid_until } = req.body;

        // Ensure valid_until is null if empty string
        const effectiveValidUntil = (!valid_until || valid_until === '') ? null : valid_until;

        const result = await pool.query(
            `INSERT INTO announcements (school_id, title, message, target_role, priority, valid_until, created_by)
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [school_id, title, message, target_role, priority, effectiveValidUntil, req.user.id]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        const logPath = path.join(__dirname, '../scripts/error_log.txt');
        fs.appendFileSync(logPath, `Error adding announcement: ${error.message}\nStack: ${error.stack}\nBody: ${JSON.stringify(req.body)}\n\n`);
        console.error("Error adding announcement:", error);
        res.status(500).json({ message: 'Server error: ' + error.message });
    }
};

exports.deleteAnnouncement = async (req, res) => {
    try {
        await pool.query('DELETE FROM announcements WHERE id = $1 AND school_id = $2', [req.params.id, req.user.schoolId]);
        res.json({ message: 'Announcement deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
