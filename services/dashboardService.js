// Import the database connection pool to execute SQL queries asynchronously
const pool = require('../database/db');

/**
 * Service to calculate a comprehensive financial summary for a specific company.
 * Every single line is commented for absolute clarity as requested.
 * @param {number} companyId - The ID of the company to get summary for.
 */
const getFinancialSummary = async (companyId) => {
    // 1. Calculate the Grand Total of all Expenses for this company
    const [expenseTotal] = await pool.query(
        'SELECT SUM(amount) as total FROM expenses WHERE company_id = ?',
        [companyId]
    );

    // 2. Calculate the Grand Total of all Income for this company
    const [incomeTotal] = await pool.query(
        'SELECT SUM(amount) as total FROM income WHERE company_id = ?',
        [companyId]
    );

    // 3. Calculate Monthly Totals for the last 6 months (Trend Analysis)
    // This query uses DATE_FORMAT to group transactions by Year and Month
    const [monthlyStats] = await pool.query(`
        SELECT
            DATE_FORMAT(expense_date, '%Y-%m') as month,
            SUM(amount) as total_spent
        FROM expenses
        WHERE company_id = ?
        GROUP BY month
        ORDER BY month DESC
        LIMIT 6
    `, [companyId]);

    // 4. Fetch the 5 most recent transactions (Combining Expenses and Income)
    // We use UNION ALL to merge results from both tables and sort them by date
    const [latest] = await pool.query(`
        (SELECT title as name, amount, expense_date as date, 'EXPENSE' as type FROM expenses WHERE company_id = ? ORDER BY expense_date DESC LIMIT 5)
        UNION ALL
        (SELECT source_name as name, amount, income_date as date, 'INCOME' as type FROM income WHERE company_id = ? ORDER BY income_date DESC LIMIT 5)
        ORDER BY date DESC LIMIT 5
    `, [companyId, companyId]);

    // Safely parse the total expense value, defaulting to 0 if null
    const totalExp = parseFloat(expenseTotal[0].total) || 0;
    // Safely parse the total income value, defaulting to 0 if null
    const totalInc = parseFloat(incomeTotal[0].total) || 0;

    // Return the final summary object containing all calculated data
    return {
        // Overall sum of money spent
        total_expenses: totalExp,
        // Overall sum of money earned
        total_income: totalInc,
        // Current balance (Total Income minus Total Expenses)
        net_balance: totalInc - totalExp,
        // History of spending per month
        monthly_breakdown: monthlyStats,
        // List of the most recent financial activities
        latest_transactions: latest
    };
};

/**
 * Service to determine the financial health of a company for the current month.
 * Logic: If Total Monthly Expenses exceed Total Monthly Income, return a warning.
 * @param {number} companyId - The ID of the company to check.
 */
const getFinancialHealth = async (companyId) => {
    // Initialize a date object for the current time
    const now = new Date();
    // Get the current month (1-12)
    const currentMonth = now.getMonth() + 1;
    // Get the current four-digit year
    const currentYear = now.getFullYear();

    // Query to sum up all expenses recorded in the current month for this company
    const [expRow] = await pool.query(
        'SELECT SUM(amount) as total FROM expenses WHERE company_id = ? AND MONTH(expense_date) = ? AND YEAR(expense_date) = ?',
        [companyId, currentMonth, currentYear]
    );

    // Query to sum up all income recorded in the current month for this company
    const [incRow] = await pool.query(
        'SELECT SUM(amount) as total FROM income WHERE company_id = ? AND MONTH(income_date) = ? AND YEAR(income_date) = ?',
        [companyId, currentMonth, currentYear]
    );

    // Parse the total monthly expenses or set to 0 if no records exist
    const monthlyExp = parseFloat(expRow[0].total) || 0;
    // Parse the total monthly income or set to 0 if no records exist
    const monthlyInc = parseFloat(incRow[0].total) || 0;

    // Detection logic: Warning is true if the company spent more than it earned this month
    const isAtRisk = monthlyExp > monthlyInc;

    // Return the health assessment results
    return {
        // Boolean flag for the UI to show an alert
        warning: isAtRisk,
        // Human-readable message explaining the status
        message: isAtRisk
            ? "Company expenses exceed income. Financial risk detected."
            : "Financial status is healthy. Your income covers your expenses this month.",
        // The raw numbers for the current month
        details: {
            monthly_expenses: monthlyExp,
            monthly_income: monthlyInc
        }
    };
};

// Export the service functions so the controller can use them
module.exports = {
    // Function to get the general summary
    getFinancialSummary,
    // Function to check for financial warnings
    getFinancialHealth
};
