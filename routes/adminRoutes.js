// Import the express module to enable routing functionality
const express = require('express');
// Create a new router instance for administrative operations
const router = express.Router();
// Import the admin controller which contains the business logic for these endpoints
const adminController = require('../controllers/adminController');
// Import security middleware for token verification and role-based access control
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

/**
 * Route for creating a new user (Admin only).
 * Endpoint: POST /api/admin/create-user
 */
// 1. verifyToken: Checks if the requester is logged in with a valid JWT
// 2. authorizeRoles('ADMIN'): Ensures only users with the ADMIN role can proceed
// 3. adminController.createUserByAdmin: The final handler that creates the user
router.post('/create-user', verifyToken, authorizeRoles('ADMIN'), adminController.createUserByAdmin);

/**
 * Route for listing all registered users (Admin only).
 * Endpoint: GET /api/admin/users
 */
// Apply same protection layer: valid token and ADMIN role required
router.get('/users', verifyToken, authorizeRoles('ADMIN'), adminController.listAllUsers);

// Export the router module to be integrated into the main server entry point
module.exports = router;
