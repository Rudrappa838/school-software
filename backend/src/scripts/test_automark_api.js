const axios = require('axios');

async function testAutoMarkAPI() {
    try {
        // First, login to get a token
        console.log('Step 1: Logging in...');
        const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'admin@school.com',
            password: 'admin123',
            role: 'SCHOOL_ADMIN'
        });

        const token = loginRes.data.token;
        console.log('✅ Login successful\n');

        // Now test auto-mark
        console.log('Step 2: Testing Auto-Mark Holidays API...');
        const autoMarkRes = await axios.post('http://localhost:5000/api/holidays/auto-mark', {
            month: 'all',
            year: 2026
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        console.log('✅ Auto-Mark Response:', autoMarkRes.data);

    } catch (e) {
        console.error('❌ Error:', e.response?.data || e.message);
        console.error('Status:', e.response?.status);
    }
}

testAutoMarkAPI();
