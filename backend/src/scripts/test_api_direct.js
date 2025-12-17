const http = require('http');

const validId = '20251-3693'; // One of the known IDs

function testApi(id) {
    const encodedId = encodeURIComponent(id);
    const path = `/api/hostel/student/${encodedId}/details`;

    console.log(`Testing GET ${path}...`);

    const req = http.request({
        hostname: 'localhost',
        port: 5000,
        path: path,
        method: 'GET'
    }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
            console.log(`Status Code: ${res.statusCode}`);
            console.log('Response Body:', data);
        });
    });

    req.on('error', (e) => {
        console.error('Request Error:', e);
    });
    req.end();
}

testApi(validId);
