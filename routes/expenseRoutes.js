// Import the express library to create a router instance
const express = require('express');
// Initialize the express router for expense-related endpoints
const router = express.Router();
// Import the expense controller that contains the handler logic
const expenseController = require('../controllers/expenseController');
// Import the token verification middleware to secure these routes
const { verifyToken } = require('../middleware/authMiddleware');

/**
 * Endpoint to record a new expense.
 * POST /api/expenses
 * Access: Authenticated users only
 */
// Map the POST request to the createExpense controller function
router.post('/', verifyToken, expenseController.createExpense);

/**
 * Endpoint to retrieve all expenses for the user's company (with pagination).
 * GET /api/expenses?page=1&limit=10
 * Access: Authenticated users only
 */
// Map the GET request to the getExpenses controller function
router.get('/', verifyToken, expenseController.getExpenses);

/**
 * Endpoint to retrieve a specific expense by its unique ID.
 * GET /api/expenses/:id
 * Access: Authenticated users only
 */
// Map the GET request with an ID parameter to the getExpenseById function
router.get('/:id', verifyToken, expenseController.getExpenseById);

/**
 * Endpoint to remove an expense record from the system.
 * DELETE /api/expenses/:id
 * Access: Authenticated users only
 */
// Map the DELETE request to the deleteExpense controller function
router.delete('/:id', verifyToken, expenseController.deleteExpense);

/**
 * Endpoint to update an existing expense record.
 * PUT /api/expenses/:id
 * Access: Authenticated users only
 */
// Map the PUT request to the updateExpense controller function
router.put('/:id', verifyToken, expenseController.updateExpense);

// Export the router module to be mounted in the main server file
module.exports = router;
