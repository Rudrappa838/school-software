const axios = require('axios');
const jwt = require('jsonwebtoken');

const BASE_URL = 'http://localhost:5000/api';
// Using the same secret as in backend .env (assuming it's 'your_jwt_secret' or similar common default for dev, 
// will need to check .env if this fails, but usually we can just login to get a real token)

const CREDENTIALS = {
    email: 'rudru888@gmail.com',
    password: 'password123' // Or whatever the password is. 
};

// Actually, let's just use the LOGIN endpoint to get a VALID token, 
// ensuring we test exactly what the app does.
async function verifyEndpoints() {
    try {
        console.log('1. Attempting Login with rudru888@gmail.com...');

        let token;
        try {
            // Try common passwords
            const res = await axios.post(`${BASE_URL}/auth/login`, {
                email: 'rudru888@gmail.com',
                password: '123456'
            });
            token = res.data.token;
            console.log('Login Successful!');
            console.log('Token Payload:', jwt.decode(token));
        } catch (e) {
            console.error('Login Failed:', e.response?.data || e.message);
            return;
        }

        const headers = { Authorization: `Bearer ${token}` };

        const endpoints = [
            { name: 'Profile', url: '/students/profile' },
            { name: 'Attendance', url: '/students/attendance/my-report?month=12&year=2025' },
            { name: 'Student Fees', url: '/students/my-fees' },
            { name: 'Transport', url: '/transport/my-route' },
            { name: 'Library', url: '/library/my-books' },
            { name: 'Timetable', url: '/timetable/my-schedule' },
            { name: 'Certificates', url: '/certificates/my-certificates' },
            { name: 'Hostel', url: '/hostel/my-details' },
            { name: 'Leaves', url: '/leaves/my-leaves' },
            { name: 'Doubts', url: '/doubts/my-doubts' },
            { name: 'Academics', url: '/marks/my-marks' },
        ];

        console.log('\n2. Verifying Endpoints...');

        for (const ep of endpoints) {
            try {
                const res = await axios.get(`${BASE_URL}${ep.url}`, { headers });
                console.log(`\n[${ep.name}] Status: ${res.status}`);
                console.log(`Response Type: ${typeof res.data}`);
                if (typeof res.data === 'object') {
                    // Summary of data
                    const keys = Object.keys(res.data);
                    console.log(`Keys: ${keys.join(', ')}`);
                    if (Array.isArray(res.data)) console.log(`Is Array: Yes, Length: ${res.data.length}`);
                }
                // console.log('Body:', JSON.stringify(res.data).substring(0, 200) + '...');
            } catch (e) {
                console.error(`\n[${ep.name}] FAILED: ${e.response?.status} - ${e.response?.statusText}`);
                if (e.response?.data) console.error('Error Body:', e.response.data);
            }
        }

    } catch (err) {
        console.error('Global Error:', err.message);
    }
}

verifyEndpoints();
