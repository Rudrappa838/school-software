const axios = require('axios');

async function testAnnouncement() {
    try {
        // 1. Login
        const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'school_admin@demo.com',
            password: '123456',
            role: 'SCHOOL_ADMIN'
        });
        const token = loginRes.data.token;
        console.log('Login successful. Token acquired.');

        // 2. Post Announcement
        try {
            const res = await axios.post('http://localhost:5000/api/calendar/announcements', {
                title: 'Test Announcement',
                message: 'This is a test.',
                target_role: 'All',
                priority: 'Normal',
                valid_until: ''
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('Announcement Posted:', res.data);
        } catch (postErr) {
            console.error('Post Failed:', postErr.response ? postErr.response.data : postErr.message);
        }

    } catch (e) {
        console.error('Test Failed:', e.message);
        if (e.response) console.error(e.response.data);
    }
}

testAnnouncement();
