const { pool } = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
    const { password, role } = req.body;
    let { email } = req.body;

    if (email) email = email.trim();

    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Verify password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Verify role enforcement (optional, but good for UI consistency)
        if (role) {
            if (role === 'STAFF') {
                // Allow DRIVER to login as STAFF
                if (!['STAFF', 'DRIVER'].includes(user.role)) {
                    return res.status(403).json({ message: `Access denied. You are not a Staff member` });
                }
            } else if (user.role !== role) {
                return res.status(403).json({ message: `Access denied. You are not a ${role}` });
            }
        }

        // Fetch Linked ID (Student/Teacher/Staff ID) to optimize downstream requests
        let linkedId = null;
        if (user.role === 'STUDENT') {
            let sRes = await pool.query('SELECT id FROM students WHERE school_id = $1 AND email = $2', [user.school_id, user.email]);
            if (sRes.rows.length === 0) {
                // Fallback for admission no based emails
                const prefix = user.email.split('@')[0];
                sRes = await pool.query('SELECT id FROM students WHERE school_id = $1 AND admission_no ILIKE $2', [user.school_id, prefix]);
            }
            if (sRes.rows.length > 0) linkedId = sRes.rows[0].id;

        } else if (user.role === 'TEACHER') {
            const tRes = await pool.query('SELECT id FROM teachers WHERE school_id = $1 AND email = $2', [user.school_id, user.email]);
            if (tRes.rows.length > 0) linkedId = tRes.rows[0].id;

        } else if (['STAFF', 'DRIVER', 'ACCOUNTANT', 'LIBRARIAN'].includes(user.role)) {
            const stRes = await pool.query('SELECT id FROM staff WHERE school_id = $1 AND email = $2', [user.school_id, user.email]);
            if (stRes.rows.length > 0) linkedId = stRes.rows[0].id;
        }

        // Generate Token
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role,
                schoolId: user.school_id,
                linkedId: linkedId // Embedded ID for fast access
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                schoolId: user.school_id
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
};

module.exports = { login };
