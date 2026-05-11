// Import the bcryptjs library for comparing hashed passwords
const bcrypt = require('bcryptjs');
// Import the jsonwebtoken library for creating signed JWT tokens
const jwt = require('jsonwebtoken');
// Import the database connection pool to execute SQL queries
const pool = require('../database/db');
// Import the logger utility to log errors and activity
const logger = require('../utils/logger');

/**
 * Service to handle the user login logic.
 * @param {string} email - The user's email address.
 * @param {string} password - The user's plain text password.
 */
const login = async (email, password) => {
    // 1. Query the database to find the user by their email address
    // We join with the roles table to get the role_name for the JWT payload
    const [users] = await pool.query(
        'SELECT u.*, r.role_name FROM users u JOIN roles r ON u.role_id = r.id WHERE u.email = ?',
        [email]
    );

    // Check if the query returned no results, meaning the email was not found
    if (users.length === 0) {
        // Return null to indicate that no user matches the provided email
        return null;
    }

    // Extract the first user record from the returned array
    const user = users[0];

    // 2. Validate the account status - Only ACTIVE users can log in to the system
    if (user.status !== 'ACTIVE') {
        // Log the unauthorized login attempt for a non-active account
        logger.error(`Login blocked: Account for ${email} is ${user.status}`);
        // Throw an error with a specific message for the status-based rejection
        throw new Error(`Your account status is ${user.status}. Access denied.`);
    }

    // 3. Compare the provided plain text password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password_hash);

    // If the passwords do not match, return null to signal authentication failure
    if (!isMatch) {
        // Return null as the credentials are invalid
        return null;
    }

    // 4. Update the user's last_login timestamp in the database to record the current activity
    await pool.query('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?', [user.id]);

    // 5. Generate a JWT token containing the user's ID, email, role, and company ID
    const token = jwt.sign(
        {
            id: user.id,
            email: user.email,
            role_name: user.role_name,
            company_id: user.company_id
        },
        // Use the secret key from the environment variables to sign the token
        process.env.JWT_SECRET,
        // Set the token's expiration time from the environment variables
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // 6. Return the signed token and essential user information (excluding the password hash)
    return {
        // The generated JWT token string
        token,
        // Basic user profile data for the client
        user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role_name,
            company_id: user.company_id
        }
    };
};

/**
 * Service to handle user account deletion.
 * @param {number} userId - The unique ID of the user to delete.
 */
const deleteAccount = async (userId) => {
    // Execute a SQL DELETE query to remove the user record from the database
    const [result] = await pool.query('DELETE FROM users WHERE id = ?', [userId]);

    // Return true if at least one row was affected (deleted), indicating success
    return result.affectedRows > 0;
};

// Export the auth service functions for use in the controller
module.exports = {
    login,
    deleteAccount
};
