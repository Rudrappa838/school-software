const axios = require('axios');

async function testAttendanceFlow() {
    try {
        console.log("1. Logging in as Student...");
        const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'rudru888@gmail.com',
            password: '123456',
            role: 'STUDENT'
        });

        const token = loginRes.data.token;
        console.log("Login Successful. Token received.");

        console.log("2. Fetching My Attendance Report...");
        const attRes = await axios.get('http://localhost:5000/api/students/attendance/my-report', {
            params: { month: 12, year: 2025 },
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log("Response Status:", attRes.status);
        console.log("Response Data:", JSON.stringify(attRes.data, null, 2));

    } catch (error) {
        console.error("Error:", error.response ? error.response.data : error.message);
    }
}

testAttendanceFlow();
