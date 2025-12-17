const { pool } = require('../config/db');

async function addTransportColumns() {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        console.log('🚌 Adding Transport columns to Students table...');

        await client.query(`
            ALTER TABLE students 
            ADD COLUMN IF NOT EXISTS transport_mode VARCHAR(20) DEFAULT 'Private',
            ADD COLUMN IF NOT EXISTS route_id INTEGER REFERENCES transport_routes(id),
            ADD COLUMN IF NOT EXISTS pickup_point VARCHAR(100);
        `);

        // Check if transport_routes table exists, if not create it broadly? 
        // No, assuming valid reference might fail if table doesn't exist.
        // So I should check table existence first or handle error.
        // Actually, let's create transport_routes if not exists first.

        await client.query(`
            CREATE TABLE IF NOT EXISTS transport_routes (
                id SERIAL PRIMARY KEY,
                school_id INTEGER NOT NULL REFERENCES schools(id),
                route_name VARCHAR(100) NOT NULL,
                vehicle_number VARCHAR(20),
                driver_name VARCHAR(100),
                driver_phone VARCHAR(20),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Re-run alter to ensure FK works
        await client.query(`
            ALTER TABLE students 
            ADD COLUMN IF NOT EXISTS transport_mode VARCHAR(20) DEFAULT 'Private',
            ADD COLUMN IF NOT EXISTS route_id INTEGER REFERENCES transport_routes(id),
            ADD COLUMN IF NOT EXISTS pickup_point VARCHAR(100);
        `);

        await client.query('COMMIT');
        console.log('✅ Transport columns added successfully!');

    } catch (err) {
        await client.query('ROLLBACK');
        console.error('❌ Error adding columns:', err);
    } finally {
        client.release();
    }
}

addTransportColumns();
