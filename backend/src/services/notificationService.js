const { pool } = require('../config/db');

// Mock SMS Service for now
// In production, integrate with Twilio, MSG91, TextLocal, etc.
const sendSMS = async (phoneNumber, message) => {
    try {
        if (!phoneNumber) return;

        // Log to console implies sending
        console.log(`[SMS GATEWAY] To: ${phoneNumber} | Message: ${message}`);

        // You would await the actual API call here
        // await axios.post('https://api.sms-provider.com/...', { ... });

        return true;
    } catch (error) {
        console.error('Failed to send SMS:', error);
        return false;
    }
};

// Mock Push Notification Service (Firebase/FCM)
// AND Save to DB for In-App Notification Center
const sendPushNotification = async (recipientId, title, body, roleHint = null) => {
    const client = await pool.connect();
    try {
        console.log(`[APP PUSH] Recipient: ${recipientId} | Title: ${title} | Body: ${body}`);

        // 1. Resolve 'users' table ID for DB persistence
        let dbUserId = null;
        let finalRole = roleHint;

        // Handle composite IDs from SalaryController (e.g. "Teacher_5")
        if (!finalRole && typeof recipientId === 'string' && recipientId.includes('_')) {
            const parts = recipientId.split('_');
            if (['Teacher', 'Staff', 'Student'].includes(parts[0])) {
                finalRole = parts[0];
                recipientId = parts[1]; // Extract the numeric ID
            }
        }

        // Default to Student if we assume numeric ID is a student (common case in this system)
        if (!finalRole) finalRole = 'Student';

        if (finalRole === 'Student') {
            // Link via email or admission_no logic used in auth
            // Simple join: users.email = students.email OR users.email = admission_no based email
            const res = await client.query(`
                SELECT u.id 
                FROM users u 
                JOIN students s ON (LOWER(u.email) = LOWER(s.email) OR u.email = LOWER(s.admission_no) || '@student.school.com')
                WHERE s.id = $1
             `, [recipientId]);
            if (res.rows.length > 0) dbUserId = res.rows[0].id;

        } else if (finalRole === 'Teacher') {
            const res = await client.query(`
                SELECT u.id 
                FROM users u 
                JOIN teachers t ON (LOWER(u.email) = LOWER(t.email) OR u.email = t.employee_id || '@teacher.school.com')
                WHERE t.id = $1
             `, [recipientId]);
            if (res.rows.length > 0) dbUserId = res.rows[0].id;

        } else if (finalRole === 'Staff') {
            const res = await client.query(`
                SELECT u.id 
                FROM users u 
                JOIN staff s ON (LOWER(u.email) = LOWER(s.email) OR u.email = s.employee_id || '@staff.school.com')
                WHERE s.id = $1
             `, [recipientId]);
            if (res.rows.length > 0) dbUserId = res.rows[0].id;
        }

        // 2. Insert into Notifications Table
        if (dbUserId) {
            await client.query(
                'INSERT INTO notifications (user_id, title, message, type) VALUES ($1, $2, $3, $4)',
                [dbUserId, title, body, 'ALERT']
            );
            console.log(`[DB NOTIFICATION] Saved for User ID: ${dbUserId}`);
        } else {
            console.warn(`[NOTIFICATION WARNING] Could not resolve User Table ID for recipient: ${recipientId} (${finalRole})`);
        }

        return true;
    } catch (error) {
        console.error('Failed to send Push Notification:', error);
        return false;
    } finally {
        client.release();
    }
};

const sendAttendanceNotification = async (user, status) => {
    try {
        const now = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        let message = '';
        let title = 'Attendance Update';

        // Customized messages based on role (implicitly handled by user object structure or could be explicit)
        // Here we assume student/parent usage primarily.

        if (status === 'Present') {
            message = `Reached school at ${now}`;
        } else if (status === 'Absent') {
            message = `Marked ABSENT today (${new Date().toLocaleDateString()})`;
        } else if (status === 'Late') {
            message = `Arrived late at ${now}`;
        }

        if (!message) return;

        // 1. Send SMS (Legacy/Reliable)
        if (user.contact_number) {
            await sendSMS(user.contact_number, `Dear Parent, your ward ${user.name} has ${message.toLowerCase()}. - School Admin`);
        }

        // 2. Send Mobile App Push Notification (Real-time)
        // Assuming user.id or user.user_id is the link to the app login
        await sendPushNotification(user.id, title, `${user.name} has ${message.toLowerCase()}.`);

    } catch (error) {
        console.error('Error sending attendance notification:', error);
    }
};

// Scheduler for 10 AM Absenteeism
const checkAndSendAbsentNotifications = async () => {
    console.log('[CRON] Running 10 AM Absentee Check...');
    const client = await pool.connect();
    try {
        const today = new Date().toISOString().split('T')[0];

        // 1. Get all students who do NOT have an attendance record for today
        // (Assuming "no record" = "absent" by 10 AM)
        const absentStudents = await client.query(`
            SELECT s.id, s.name, s.contact_number, s.school_id 
            FROM students s
            WHERE s.id NOT IN (
                SELECT student_id FROM student_attendance WHERE date = $1
            )
        `, [today]);

        console.log(`[CRON] Found ${absentStudents.rows.length} students currently absent.`);

        // 2. Mark them as 'Absent' in DB and Send SMS
        for (const student of absentStudents.rows) {
            // A. Insert 'Absent' record to avoid sending SMS twice if script re-runs
            await client.query(`
                INSERT INTO student_attendance (student_id, date, status, school_id) 
                VALUES ($1, $2, 'Absent', $3)
            `, [student.id, today, student.school_id]);

            // B. Send Notification
            await sendAttendanceNotification(student, 'Absent');
        }

    } catch (error) {
        console.error('[CRON] Error during absentee check:', error);
    } finally {
        client.release();
    }
};

module.exports = { sendSMS, sendAttendanceNotification, checkAndSendAbsentNotifications, sendPushNotification };
