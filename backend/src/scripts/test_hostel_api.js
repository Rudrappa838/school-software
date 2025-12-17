const axios = require('axios');

async function testHostelAPI() {
    try {
        // 1. Login
        console.log('Logging in...');
        const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'rudru888@gmail.com',
            password: '123456',
            role: 'STUDENT'
        });

        const token = loginRes.data.token;
        console.log('Login successful. Token obtained.');
        console.log('School ID in token might be:', loginRes.data.user.schoolId);

        // 2. Call Hostel Details
        console.log('Calling /api/hostel/my-details...');
        const hostelRes = await axios.get('http://localhost:5000/api/hostel/my-details', {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log('Response Status:', hostelRes.status);
        console.log('Response Data:', hostelRes.data);

    } catch (error) {
        console.error('Error:');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        } else {
            console.error(error.message);
        }
    }
}

testHostelAPI();
