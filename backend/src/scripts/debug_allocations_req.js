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
                console.log('Body:', data.substring(0, 200)); // limit output
                resolve();
            });
        });

        req.on('error', (e) => {
            console.error(`Problem: ${e.message}`);
            reject(e);
        });
        req.end();
    });
}

makeRequest('/1/allocations');
