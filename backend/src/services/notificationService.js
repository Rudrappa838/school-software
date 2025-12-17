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

const sendAttendanceNotification = async (student, status) => {
    try {
        if (!student.contact_number) return;

        let message = '';
        const now = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

        if (status === 'Present') {
            message = `Dear Parent, your ward ${student.name} has reached school at ${now}. - School Admin`;
        } else if (status === 'Absent') {
            message = `Dear Parent, your ward ${student.name} is marked ABSENT today (${new Date().toLocaleDateString()}). Please contact school if this is an error. - School Admin`;
        } else if (status === 'Late') {
            message = `Dear Parent, your ward ${student.name} has arrived late to school at ${now}. - School Admin`;
        }

        if (message) {
            await sendSMS(student.contact_number, message);
        }
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

module.exports = { sendSMS, sendAttendanceNotification, checkAndSendAbsentNotifications };
