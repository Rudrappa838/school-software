const { pool } = require('../config/db');

const addBiometricColumns = async () => {
    try {
        console.log('Adding biometric columns to users...');

        const queries = [
            `ALTER TABLE students ADD COLUMN IF NOT EXISTS biometric_template TEXT`,
            `ALTER TABLE students ADD COLUMN IF NOT EXISTS rfid_card_id VARCHAR(50) UNIQUE`,
            `ALTER TABLE teachers ADD COLUMN IF NOT EXISTS biometric_template TEXT`,
            `ALTER TABLE teachers ADD COLUMN IF NOT EXISTS rfid_card_id VARCHAR(50) UNIQUE`,
            `ALTER TABLE staff ADD COLUMN IF NOT EXISTS biometric_template TEXT`,
            `ALTER TABLE staff ADD COLUMN IF NOT EXISTS rfid_card_id VARCHAR(50) UNIQUE`
        ];

        for (const query of queries) {
            await pool.query(query);
        }

        console.log('Successfully added biometric columns.');
    } catch (error) {
        console.error('Error adding columns:', error);
    } finally {
        await pool.end();
    }
};

addBiometricColumns();
