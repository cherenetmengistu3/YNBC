const express = require('express');
const router = express.Router();
const healthController = require('../controllers/healthController');

/**
 * Route definition for health check.
 * Links the /status endpoint to the getHealthStatus controller function.
 */
router.get('/status', healthController.getHealthStatus);

module.exports = router;
