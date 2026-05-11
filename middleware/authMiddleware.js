// Import the jsonwebtoken library to handle token verification operations
const jwt = require('jsonwebtoken');
// Import the custom logger utility to record errors and system events
const logger = require('../utils/logger');

/**
 * Middleware function to verify if the incoming request has a valid JWT token.
 */
const verifyToken = (req, res, next) => {
    // Retrieve the 'authorization' header from the incoming request object
    const authHeader = req.headers['authorization'];
    // Extract the token part from the header, assuming it follows the "Bearer <token>" format
    const token = authHeader && authHeader.split(' ')[1];

    // Check if the token is missing from the request headers entirely
    if (!token) {
        // Return a 401 Unauthorized status if no token is provided to the server
        return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
    }

    try {
        // Verify the provided token using the secret key defined in the environment configuration
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Attach the decoded token payload (containing user info) to the request object for downstream use
        req.user = decoded;
        // Proceed to the next middleware or controller function in the request lifecycle
        next();
    } catch (error) {
        // Log the specific error message encountered during token verification for debugging
        logger.error('Invalid Token Error: ' + error.message);
        // Return a 403 Forbidden status indicating the token is either invalid or has expired
        return res.status(403).json({ success: false, message: 'Invalid or expired token.' });
    }
};

/**
 * Middleware factory function that returns a middleware for role-based access control.
 */
const authorizeRoles = (...roles) => {
    // Return an anonymous middleware function that performs the role validation check
    return (req, res, next) => {
        // Verify that the user exists on the request and their role matches one of the allowed roles
        if (!req.user || !roles.includes(req.user.role_name)) {
            // Log an unauthorized access attempt with the user's role if available
            logger.error(`Unauthorized access attempt by role: ${req.user ? req.user.role_name : 'unknown'}`);
            // Return a 403 Forbidden response notifying the client they lack the necessary permissions
            return res.status(403).json({
                success: false,
                message: `Access denied. Your role is not authorized for this resource.`
            });
        }
        // If the user's role is authorized, continue to the next handler in the route pipeline
        next();
    };
};

// Export the verification and authorization middleware functions for use in the application routes
module.exports = {
    verifyToken,
    authorizeRoles
};
