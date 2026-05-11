const healthService = require('../services/healthService');

/**
 * Controller to handle health check requests.
 * It interacts with the healthService to verify if the database is up and running.
 */
const getHealthStatus = async (req, res, next) => {
    try {
        const dbStatus = await healthService.checkDatabaseConnection();
        res.status(200).json({
            success: true,
            message: 'Backend is running correctly',
            database: dbStatus ? 'Connected' : 'Disconnected'
        });
    } catch (error) {
        // Pass the error to the centralized error handler middleware
        next(error);
    }
};

module.exports = {
    getHealthStatus
};
