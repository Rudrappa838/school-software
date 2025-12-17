const axios = require('axios');

async function testLibraryFlow() {
    try {
        console.log("1. Logging in as Student...");
        const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'rudru888@gmail.com',
            password: '123456',
            role: 'STUDENT'
        });

        const token = loginRes.data.token;
        console.log("Login Successful. Token received.");

        console.log("2. Fetching My Library Books...");
        const booksRes = await axios.get('http://localhost:5000/api/library/my-books', {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log("Response Status:", booksRes.status);
        console.log("Response Data:", JSON.stringify(booksRes.data, null, 2));

        if (booksRes.data.length === 0) {
            console.log("No books found. This might be expected if none are issued. But API call worked.");
        }

    } catch (error) {
        console.error("Error:", error.response ? error.response.data : error.message);
    }
}

testLibraryFlow();
