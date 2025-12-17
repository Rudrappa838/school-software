const { pool } = require('../config/db');

async function fixTeacherVehicleLoc() {
    const client = await pool.connect();
    try {
        const email = 'rudru8888@gmail.com';

        // 1. Get Teacher's Route ID
        const tRes = await client.query('SELECT transport_route_id FROM teachers WHERE email = $1', [email]);
        if (tRes.rows.length === 0) {
            console.log("Teacher not found");
            return;
        }
        const routeId = tRes.rows[0].transport_route_id;
        console.log("Teacher Route ID:", routeId);

        if (!routeId) {
            console.log("No route assigned to teacher.");
            return;
        }

        // 2. Get Vehicle ID from Route
        const rRes = await client.query('SELECT vehicle_id FROM transport_routes WHERE id = $1', [routeId]);
        if (rRes.rows.length === 0) {
            console.log("Route not found");
            return;
        }
        const vehicleId = rRes.rows[0].vehicle_id;
        console.log("Vehicle ID:", vehicleId);

        if (!vehicleId) {
            console.log("No vehicle assigned to route.");
            return;
        }

        // 3. Update Vehicle Location (Bagalkot)
        const lat = 16.1691;
        const lng = 75.6940;

        const vRes = await client.query(
            `UPDATE transport_vehicles 
             SET current_lat = $1, current_lng = $2 
             WHERE id = $3 RETURNING *`,
            [lat, lng, vehicleId]
        );

        console.log("Updated Vehicle:", vRes.rows[0]);

    } catch (err) {
        console.error(err);
    } finally {
        client.release();
        pool.end();
    }
}

fixTeacherVehicleLoc();
