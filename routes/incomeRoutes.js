// Import the express library to create a router instance for the income module
const express = require('express');
// Initialize a new Express router object
const router = express.Router();
// Import the income controller which contains the business logic for these endpoints
const incomeController = require('../controllers/incomeController');
// Import the authentication middleware to verify JWT tokens
const { verifyToken } = require('../middleware/authMiddleware');

/**
 * Route to record a new income entry.
 * POST /api/income
 * Access: Authenticated users only
 */
// Every line is commented: apply verifyToken first, then call createIncome in the controller
router.post('/', verifyToken, incomeController.createIncome);

/**
 * Route to retrieve a list of all income entries for the user's company.
 * GET /api/income?page=1&limit=10
 * Access: Authenticated users only
 */
// Every line is commented: protect the route with JWT and handle with getIncome controller
router.get('/', verifyToken, incomeController.getIncome);

/**
 * Route to fetch details for a specific income record by its ID.
 * GET /api/income/:id
 * Access: Authenticated users only
 */
// Every line is commented: use URL parameter :id and verify the user before fetching details
router.get('/:id', verifyToken, incomeController.getIncomeById);

/**
 * Route to remove an income record from the system.
 * DELETE /api/income/:id
 * Access: Authenticated users only
 */
// Every line is commented: ensure the user is authenticated before allowing deletion
router.delete('/:id', verifyToken, incomeController.deleteIncome);

// Export the router module to be integrated into the main application in server.js
module.exports = router;
