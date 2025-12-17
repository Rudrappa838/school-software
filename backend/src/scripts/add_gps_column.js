const { pool } = require('../config/db');

const addGpsColumn = async () => {
    try {
        console.log('Adding gps_device_id column to transport_vehicles table...');

        // precise SQL to add column if it doesn't exist
        await pool.query(`
            DO $$ 
            BEGIN 
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                               WHERE table_name='transport_vehicles' AND column_name='gps_device_id') THEN 
                    ALTER TABLE transport_vehicles ADD COLUMN gps_device_id VARCHAR(100); 
                END IF; 
            END $$;
        `);

        // Ensure current_lat and current_lng are float/double if not already (just in case)
        // Usually they are created as such, but let's just focus on the new column.

        console.log('Successfully added gps_device_id column.');
    } catch (error) {
        console.error('Error updating schema:', error);
    } finally {
        await pool.end();
    }
};

addGpsColumn();
