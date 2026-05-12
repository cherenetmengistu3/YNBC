// Import the expense service to handle business logic and database interactions
const expenseService = require('../services/expenseService');
// Import the custom logger utility for recording application activity and errors
const logger = require('../utils/logger');

/**
 * Controller to handle the creation of a new expense.
 * Validates the input and uses the service to save the record.
 */
const createExpense = async (req, res, next) => {
    // Start a try-catch block for safe asynchronous execution
    try {
        // Extract required fields from the request body
        const { title, amount, category, payment_method, expense_date } = req.body;

        // Perform basic validation: Ensure required fields are not empty or invalid
        if (!title || !amount || !category || !payment_method || !expense_date) {
            // Return a 400 Bad Request if validation fails
            return res.status(400).json({ success: false, message: 'All fields are required.' });
        }

        // Validate that amount is a positive number
        if (isNaN(amount) || amount <= 0) {
            // Return error if amount is not a valid number
            return res.status(400).json({ success: false, message: 'Amount must be a positive number.' });
        }

        // Retrieve company ID and user ID from the decoded JWT token (attached by auth middleware)
        const companyId = req.user.company_id;
        const userId = req.user.id;

        // Call the service to create the expense record in the database
        const expenseId = await expenseService.createExpense(req.body, companyId, userId);

        // Send a 201 Created response back to the client
        res.status(201).json({
            success: true,
            message: 'Expense recorded successfully.',
            data: { id: expenseId }
        });
    } catch (error) {
        // Record the error in the server logs
        logger.error('Create Expense Error: ' + error.message);
        // Forward the error to the global centralized error handler
        next(error);
    }
};

/**
 * Controller to fetch all expenses for the user's company with pagination support.
 */
const getExpenses = async (req, res, next) => {
    // Try block to capture potential errors
    try {
        // Get pagination parameters from the query string (defaults: page 1, limit 10)
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        // Calculate the starting row index for the database query
        const offset = (page - 1) * limit;

        // Extract company ID from the user's token for data isolation
        const companyId = req.user.company_id;

        // Use the service to get the specific page of expenses for this company
        const expenses = await expenseService.getCompanyExpenses(companyId, limit, offset);

        // Return a 200 OK response with the list of expenses
        res.status(200).json({
            success: true,
            page: page,
            limit: limit,
            data: expenses
        });
    } catch (error) {
        // Log the retrieval error
        logger.error('Get Expenses Error: ' + error.message);
        // Pass error to the global handler
        next(error);
    }
};

/**
 * Controller to fetch a specific expense by its ID.
 */
const getExpenseById = async (req, res, next) => {
    // Try block for error safety
    try {
        // Get the expense ID from the URL parameters
        const expenseId = req.params.id;
        // Get company ID from the token to ensure the user can only see their company's data
        const companyId = req.user.company_id;

        // Call service to find the expense record
        const expense = await expenseService.getExpenseById(expenseId, companyId);

        // Check if the record exists
        if (!expense) {
            // Return 404 Not Found if the ID is invalid or belongs to another company
            return res.status(404).json({ success: false, message: 'Expense record not found.' });
        }

        // Return the found expense record
        res.status(200).json({
            success: true,
            data: expense
        });
    } catch (error) {
        // Log error and pass to handler
        logger.error('Get Expense Detail Error: ' + error.message);
        next(error);
    }
};

/**
 * Controller to handle deletion of an expense.
 */
const deleteExpense = async (req, res, next) => {
    // Try block to safely execute deletion
    try {
        // ID of the expense to delete from URL
        const expenseId = req.params.id;
        // Company ID from token for security check
        const companyId = req.user.company_id;

        // Call the service to perform the deletion
        const isDeleted = await expenseService.deleteExpense(expenseId, companyId);

        // Check if the deletion was successful
        if (!isDeleted) {
            // Error if record wasn't found or doesn't belong to the user's company
            return res.status(404).json({ success: false, message: 'Expense not found or unauthorized.' });
        }

        // Return success message
        res.status(200).json({
            success: true,
            message: 'Expense record deleted successfully.'
        });
    } catch (error) {
        // Log the deletion error
        logger.error('Delete Expense Error: ' + error.message);
        // Pass to global error middleware
        next(error);
    }
};

// Export the controller methods to be mapped in expenseRoutes.js
module.exports = {
    createExpense,
    getExpenses,
    getExpenseById,
    deleteExpense
};
