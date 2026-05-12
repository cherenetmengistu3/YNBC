// Import the income service to handle database operations for revenue records
const incomeService = require('../services/incomeService');
// Import the custom logger utility for centralized error logging
const logger = require('../utils/logger');

/**
 * Controller to handle the addition of a new income record.
 */
const createIncome = async (req, res, next) => {
    // Wrap logic in a try-catch block to handle async errors
    try {
        // Extract required fields from the JSON body of the request
        const { source_name, amount, income_date } = req.body;

        // Basic validation: Check if mandatory fields are missing
        if (!source_name || !amount || !income_date) {
            // Return 400 error if validation fails
            return res.status(400).json({ success: false, message: 'Source name, amount, and date are required.' });
        }

        // Numerical validation: Ensure the amount is a positive number
        if (isNaN(amount) || amount <= 0) {
            // Return error for invalid amounts
            return res.status(400).json({ success: false, message: 'Income amount must be a positive number.' });
        }

        // Get company ID and user ID from the user's authenticated token
        const companyId = req.user.company_id;
        const userId = req.user.id;

        // Call the service to save the income record to the database
        const incomeId = await incomeService.createIncome(req.body, companyId, userId);

        // Return a 201 Created response to the client
        res.status(201).json({
            success: true,
            message: 'Income recorded successfully.',
            data: { id: incomeId }
        });
    } catch (error) {
        // Log any errors that occurred during processing
        logger.error('Create Income Controller Error: ' + error.message);
        // Pass the error to the global error middleware
        next(error);
    }
};

/**
 * Controller to retrieve all income records for a specific company with pagination.
 */
const getIncome = async (req, res, next) => {
    // Try-catch block for safe async handling
    try {
        // Parse page and limit from query parameters with default values
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        // Calculate offset for the SQL LIMIT clause
        const offset = (page - 1) * limit;

        // Extract company ID from the token for data isolation
        const companyId = req.user.company_id;

        // Fetch the list of income records using the service layer
        const incomes = await incomeService.getCompanyIncome(companyId, limit, offset);

        // Send a 200 OK response with the results
        res.status(200).json({
            success: true,
            page: page,
            limit: limit,
            data: incomes
        });
    } catch (error) {
        // Log the error
        logger.error('Get Income Controller Error: ' + error.message);
        // Forward to error handler
        next(error);
    }
};

/**
 * Controller to fetch details for a single income record.
 */
const getIncomeById = async (req, res, next) => {
    // Try block for error safety
    try {
        // Get the ID from the URL path
        const incomeId = req.params.id;
        // Get company ID for security check
        const companyId = req.user.company_id;

        // Request the specific record from the service
        const income = await incomeService.getIncomeById(incomeId, companyId);

        // If no record is found or it belongs to another company
        if (!income) {
            // Return 404 Not Found
            return res.status(404).json({ success: false, message: 'Income record not found.' });
        }

        // Return the record data
        res.status(200).json({
            success: true,
            data: income
        });
    } catch (error) {
        // Log and pass error
        logger.error('Get Income Detail Controller Error: ' + error.message);
        next(error);
    }
};

/**
 * Controller to delete an income record.
 */
const deleteIncome = async (req, res, next) => {
    // Try block to handle deletion
    try {
        // Get ID from URL
        const incomeId = req.params.id;
        // Get company ID from token for authorization
        const companyId = req.user.company_id;

        // Instruct service to delete the record
        const isDeleted = await incomeService.deleteIncome(incomeId, companyId);

        // Check if deletion occurred
        if (!isDeleted) {
            // Error if record not found or access denied
            return res.status(404).json({ success: false, message: 'Income not found or unauthorized.' });
        }

        // Confirm deletion
        res.status(200).json({
            success: true,
            message: 'Income record deleted successfully.'
        });
    } catch (error) {
        // Log error and forward to handler
        logger.error('Delete Income Controller Error: ' + error.message);
        next(error);
    }
};

// Export all controller functions for route mapping
module.exports = {
    createIncome,
    getIncome,
    getIncomeById,
    deleteIncome
};
