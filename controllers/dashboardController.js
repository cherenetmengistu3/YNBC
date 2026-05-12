// Import the dashboard service to handle financial calculation logic
const dashboardService = require('../services/dashboardService');
// Import the custom logger utility for recording errors and system info
const logger = require('../utils/logger');

/**
 * Controller to handle requests for the financial summary dashboard.
 * It provides totals for income, expenses, and current balance.
 */
const getSummary = async (req, res, next) => {
    // Use a try-catch block for safe asynchronous operation and error forwarding
    try {
        // Retrieve the company ID from the authenticated user's JWT token
        // This ensures that users only see data belonging to their own company
        const companyId = req.user.company_id;

        // Call the dashboard service to perform the financial calculations
        const summary = await dashboardService.getFinancialSummary(companyId);

        // Return a 200 OK response with the calculated summary data
        res.status(200).json({
            // Indicate a successful operation
            success: true,
            // Attach the summary results (totals and latest transactions)
            data: summary
        });
    } catch (error) {
        // Log the specific error message to the server console for debugging
        logger.error('Dashboard Summary Controller Error: ' + error.message);
        // Pass the caught error to the next middleware (centralized error handler)
        next(error);
    }
};

/**
 * Controller to handle requests for the company's financial health status.
 * It checks if the company is spending more than it earns this month.
 */
const getHealthStatus = async (req, res, next) => {
    // Wrap logic in try-catch to manage async execution and potential failures
    try {
        // Extract company ID from the user's token for data isolation (Multi-tenancy)
        const companyId = req.user.company_id;

        // Use the service layer to determine if there are any financial risks
        const healthStatus = await dashboardService.getFinancialHealth(companyId);

        // Send back a 200 OK response with the risk assessment results
        res.status(200).json({
            // Operation was successful
            success: true,
            // Include warning status, message, and details (income vs expense)
            data: healthStatus
        });
    } catch (error) {
        // Record the error in the server log file/console
        logger.error('Financial Health Controller Error: ' + error.message);
        // Forward the error to the global error middleware
        next(error);
    }
};

// Export the controller methods to be used in the dashboard routing module
module.exports = {
    // Export summary endpoint handler
    getSummary,
    // Export health warning endpoint handler
    getHealthStatus
};
