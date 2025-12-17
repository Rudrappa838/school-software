const http = require('http');

function makeRequest(path) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 5000,
            path: '/api/hostel' + path,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                console.log(`GET ${path} -> Status: ${res.statusCode}`);
                try {
                    console.log('Body:', JSON.parse(data));
                } catch (e) {
                    console.log('Body:', data);
                }
                resolve();
            });
        });

        req.on('error', (e) => {
            console.error(`Problem with request to ${path}: ${e.message}`);
            reject(e);
        });
        req.end();
    });
}

async function runTests() {
    try {
        await makeRequest(''); // Get All Hostels
        await makeRequest('/1/allocations'); // Get Allocations for ID 1
        await makeRequest('/student/ADM1/details'); // Get Student Details (assuming ADM1 doesn't exist returns 404)
    } catch (e) {
        console.error(e);
    }
}

runTests();
