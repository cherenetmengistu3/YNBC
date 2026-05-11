// Import the express module to create a router instance
const express = require('express');
// Initialize a new router object for the authentication module
const router = express.Router();
// Import the authentication controller to handle the logic for these routes
const authController = require('../controllers/authController');
// Import the token verification middleware to protect specific endpoints
const { verifyToken } = require('../middleware/authMiddleware');

/**
 * Route for user login.
 * Endpoint: POST /api/auth/login
 * Accessibility: Public (No token required)
 */
// Map the POST /login request to the loginUser function in the auth controller
router.post('/login', authController.loginUser);

/**
 * Route for an authenticated user to delete their own account.
 * Endpoint: DELETE /api/auth/delete-account
 * Accessibility: Protected (Valid JWT token required)
 */
// Protect this route with verifyToken middleware before calling the controller
router.delete('/delete-account', verifyToken, authController.deleteMyAccount);

// Export the router instance so it can be mounted in the main server file
module.exports = router;
