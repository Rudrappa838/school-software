const { pool } = require('../config/db');

async function addTransportToTeacher() {
    const client = await pool.connect();
    try {
        await client.query(`
            ALTER TABLE teachers 
            ADD COLUMN IF NOT EXISTS transport_route_id INTEGER REFERENCES transport_routes(id) ON DELETE SET NULL;
        `);
        console.log("Added transport_route_id to teachers table.");

        // Assign a route to our demo teacher (rudru8888@gmail.com)
        // First check if any route exists
        let routeRes = await client.query("SELECT id FROM transport_routes LIMIT 1");
        let routeId;

        if (routeRes.rows.length === 0) {
            console.log("No routes found, creating a dummy route...");
            const vRes = await client.query("INSERT INTO transport_vehicles (school_id, vehicle_number, capacity, driver_name, driver_phone) VALUES (1, 'KA-01-F-9999', 40, 'Ramesh Driver', '9998887770') RETURNING id");
            const vId = vRes.rows[0].id;

            const rCreate = await client.query("INSERT INTO transport_routes (school_id, route_name, vehicle_id) VALUES (1, 'Route 1 - Main City', $1) RETURNING id", [vId]);
            routeId = rCreate.rows[0].id;
        } else {
            routeId = routeRes.rows[0].id;
        }

        const email = 'rudru8888@gmail.com';
        await client.query("UPDATE teachers SET transport_route_id = $1 WHERE email = $2", [routeId, email]);
        console.log(`Assigned Route ID ${routeId} to teacher ${email}`);

    } catch (err) {
        console.error(err);
    } finally {
        client.release();
        pool.end();
    }
}

addTransportToTeacher();
