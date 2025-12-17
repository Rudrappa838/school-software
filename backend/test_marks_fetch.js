// Quick test script to check if marks are in database
const fetch = require('node-fetch');

async function testMarks() {
    try {
        // You'll need to get a valid token first by logging in
        const token = 'YOUR_TOKEN_HERE'; // Replace with actual token

        const response = await fetch('http://localhost:3000/api/marks?class_id=1&section_id=1&exam_type_id=1', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();
        console.log('Marks data from database:');
        console.log(JSON.stringify(data, null, 2));

        if (data.length === 0) {
            console.log('\n⚠️  NO MARKS FOUND - Database might be empty');
        } else {
            console.log(`\n✅ Found ${data.length} mark entries`);
            console.log('Sample mark:', data[0]);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

testMarks();
