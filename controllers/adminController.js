// Import the user service module to interact with user-related database logic
const userService = require('../services/userService');
// Import the logger utility to record events and errors for debugging
const logger = require('../utils/logger');

/**
 * Controller function to allow an administrator to create a new user account.
 */
const createUserByAdmin = async (req, res, next) => {
    // Start a try block to handle any asynchronous errors during execution
    try {
        // Destructure necessary fields from the request body sent by the client
        const { username, email, password, company_id, role_id, status } = req.body;

        // Check if any of the mandatory fields are missing from the request
        if (!username || !email || !password || !company_id || !role_id) {
            // Return a 400 Bad Request response if validation fails
            return res.status(400).json({
                // Indicate that the operation was not successful
                success: false,
                // Provide a clear message about the missing required fields
                message: 'All fields (username, email, password, company_id, role_id) are required.'
            });
        }

        // Invoke the adminCreateUser service function to hash the password and save to DB
        const userId = await userService.adminCreateUser(req.body);

        // Respond with a 201 Created status upon successful user creation
        res.status(201).json({
            // Set success property to true for the client's response handler
            success: true,
            // Confirm the successful creation with a descriptive message
            message: 'User created successfully by admin.',
            // Return the newly generated user ID to the client
            data: { userId }
        });
    } catch (error) {
        // Log the error message to the server console using the logger utility
        logger.error('Admin Create User Error: ' + error.message);
        // Pass the caught error to the next middleware (global error handler)
        next(error);
    }
};

/**
 * Controller function to retrieve a list of all users for administrative viewing.
 */
const listAllUsers = async (req, res, next) => {
    // Wrap the operation in a try block for error safety
    try {
        // Call the service function to fetch all user records from the database
        const users = await userService.getAllUsers();
        // Return a 200 OK response with the retrieved users list
        res.status(200).json({
            // Indicate the request was fulfilled successfully
            success: true,
            // Provide the array of user objects as the response data
            data: users
        });
    } catch (error) {
        // Record the error in the server logs
        logger.error('Admin List Users Error: ' + error.message);
        // Forward the error to the centralized error handling middleware
        next(error);
    }
};

// Export the controller functions for use in the admin routing module
module.exports = {
    // Export user creation functionality
    createUserByAdmin,
    // Export user listing functionality
    listAllUsers
};
