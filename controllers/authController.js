// Import the authentication service to handle business logic like login and account management
const authService = require('../services/authService');
// Import the custom logger utility to record application errors and info
const logger = require('../utils/logger');

/**
 * Controller function to handle user login requests.
 * It validates inputs, calls the service, and returns the authentication result.
 */
const loginUser = async (req, res, next) => {
    // Start a try-catch block to handle any unexpected errors during the process
    try {
        // Destructure the email and password from the incoming request body
        const { email, password } = req.body;

        // Check if either the email or password field is missing from the request
        if (!email || !password) {
            // Return a 400 Bad Request response if the required fields are empty
            return res.status(400).json({ success: false, message: 'Email and password are required.' });
        }

        // Invoke the login service to verify the credentials and generate a session token
        const result = await authService.login(email, password);

        // Check if the service returned null, indicating invalid credentials or non-existent user
        if (!result) {
            // Return a 401 Unauthorized response if the authentication failed
            return res.status(401).json({ success: false, message: 'Invalid email or password.' });
        }

        // Send a 200 OK response with the login success message and the token/user data
        res.status(200).json({
            // Indicate success
            success: true,
            // Success message
            message: 'Login successful',
            // Return the user data and token
            data: result
        });
    } catch (error) {
        // Log the specific login error message for debugging purposes
        logger.error('Login Process Error: ' + error.message);
        // Pass the caught error to the next middleware (error handler) for processing
        next(error);
    }
};

/**
 * Controller function to allow an authenticated user to delete their own account.
 */
const deleteMyAccount = async (req, res, next) => {
    // Use a try-catch block for safe execution and error propagation
    try {
        // Retrieve the user's ID from the request object, which was attached by the verifyToken middleware
        const userId = req.user.id;

        // Call the service function to perform the actual deletion of the user record from the database
        const deleted = await authService.deleteAccount(userId);

        // Check if the deletion service returned false, meaning the user was not found
        if (!deleted) {
            // Return a 404 Not Found response if the account record does not exist
            return res.status(404).json({ success: false, message: 'User account not found.' });
        }

        // Return a 200 OK response indicating that the account was successfully removed
        res.status(200).json({
            // Success status
            success: true,
            // Completion message
            message: 'Your account has been deleted successfully.'
        });
    } catch (error) {
        // Record the error in the server logs
        logger.error('Account Deletion Error: ' + error.message);
        // Forward the error to the global centralized error handler
        next(error);
    }
};

// Export the controller functions so they can be mapped to routes in authRoutes.js
module.exports = {
    // Export login function
    loginUser,
    // Export delete account function
    deleteMyAccount
};
