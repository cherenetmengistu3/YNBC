const pool = require('../database/db');

/**
 * Service to check database connectivity.
 * Executes a simple query to ensure the pool is working and the database is reachable.
 */
const checkDatabaseConnection = async () => {
    // We use a simple query like SELECT 1 to verify the connection
    const [rows] = await pool.query('SELECT 1 as connection_status');
    return rows[0];
};

module.exports = {
    checkDatabaseConnection
};
