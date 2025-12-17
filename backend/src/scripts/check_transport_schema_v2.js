const { pool } = require('../config/db');

(async () => {
    try {
        console.log("Checking tables...");
        const res = await pool.query(`SELECT table_name FROM information_schema.tables WHERE table_schema='public'`);
        const tables = res.rows.map(r => r.table_name);
        console.log("Tables:", tables);

        if (tables.includes('transport_vehicles')) {
            const cols = await pool.query(`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'transport_vehicles'`);
            console.log("Vehicles Cols:", cols.rows.map(c => c.column_name));
        } else {
            console.log("transport_vehicles table MISSING");
        }

        if (tables.includes('transport_routes')) {
            const cols = await pool.query(`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'transport_routes'`);
            console.log("Routes Cols:", cols.rows.map(c => c.column_name));
        }

        if (tables.includes('transport_stops')) {
            const cols = await pool.query(`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'transport_stops'`);
            console.log("Stops Cols:", cols.rows.map(c => c.column_name));
        }

    } catch (e) {
        console.error(e);
    } finally {
        pool.end();
    }
})();
