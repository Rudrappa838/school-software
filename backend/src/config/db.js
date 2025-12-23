const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
    ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
    max: 20, // Increased pool size to handling more concurrent requests
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000, // Increased timeout to 10s
    keepAlive: true, // Keep connection alive to prevent dropouts
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    // process.exit(-1); // Don't crash the server
});

module.exports = { pool };
