// Import the express library to create a router for dashboard endpoints
const express = require('express');
// Initialize a new Express router instance
const router = express.Router();
// Import the dashboard controller which contains the business logic for summary and health
const dashboardController = require('../controllers/dashboardController');
// Import the authentication middleware to verify JWT tokens
const { verifyToken } = require('../middleware/authMiddleware');

/**
 * Route to retrieve a financial summary for the company.
 * GET /api/dashboard/summary
 * Access: Authenticated users only
 */
// Every line is commented: apply verifyToken first, then call getSummary in the controller
router.get('/summary', verifyToken, dashboardController.getSummary);

/**
 * Route to retrieve the financial health status and bankruptcy warning.
 * GET /api/dashboard/financial-health
 * Access: Authenticated users only
 */
// Every line is commented: protect the route with JWT and handle with getHealthStatus controller
router.get('/financial-health', verifyToken, dashboardController.getHealthStatus);

// Export the router module to be integrated into the main application in server.js
module.exports = router;
