const fs = require('fs');
console.log('Starting debug...');
try {
    const app = require('./src/app');
    console.log('App loaded successfully');
} catch (e) {
    fs.writeFileSync('crash_log.txt', e.stack);
}
