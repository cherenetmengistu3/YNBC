// Import the authentication service to handle business logic like login and account management
const authService = require('../services/authService');
// Import the custom logger utility to record application errors and info
const logger = require('../utils/logger');

/**
 * Controller function to handle user login requests.
 * It validates inputs, calls the service, and returns the authentication result.
 */
const loginUser = async (req, res, next) => {
    try {
        // [DEBUG] Log the incoming request body (excluding password for security in production, but included here for debugging)
        console.log('[DEBUG] Login Request Body:', { email: req.body.email, passwordProvided: !!req.body.password });

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required.' });
        }

        const result = await authService.login(email, password);

        if (!result) {
            // [DEBUG] Log that service returned null
            console.log('[DEBUG] Login result: Authentication Failed (Invalid email or password)');
            return res.status(401).json({ success: false, message: 'Invalid email or password.' });
        }

        console.log('[DEBUG] Login result: Authentication Success');
        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: result
        });
    } catch (error) {
        logger.error('Login Process Error: ' + error.message);
        next(error);
    }
};

/**
 * Controller function to allow an authenticated user to delete their own account.
 */
const deleteMyAccount = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const deleted = await authService.deleteAccount(userId);

        if (!deleted) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        res.status(200).json({
            success: true,
            message: 'Your account has been deleted successfully.'
        });
    } catch (error) {
        logger.error('Account Deletion Error: ' + error.message);
        next(error);
    }
};

module.exports = {
    loginUser,
    deleteMyAccount
};
