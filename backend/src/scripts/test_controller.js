require('dotenv').config();
const { syncFromCalendar } = require('../controllers/holidayController');
const { pool } = require('../config/db');

async function testSync() {
    console.log('=== TEST SYNC CONTROLLER ===');

    // Mock Req/Res
    const req = {
        user: { id: 1, schoolId: 1 }, // Assuming user 1, school 1
        body: { year: 2026 }
    };

    const res = {
        status: (code) => {
            console.log(`Response Status: ${code}`);
            return res;
        },
        json: (data) => {
            console.log('Response JSON:', JSON.stringify(data, null, 2));
            return res;
        }
    };

    try {
        await syncFromCalendar(req, res);
    } catch (e) {
        console.error('Unhandled Error:', e);
    } finally {
        pool.end();
    }
}

testSync();
