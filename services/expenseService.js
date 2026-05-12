// Import the database connection pool to execute SQL queries asynchronously
const pool = require('../database/db');

/**
 * Service to handle creation of a new expense.
 */
const createExpense = async (expenseData, companyId, userId) => {
    // Destructure required fields from the expenseData object
    const { title, description, category, amount, payment_method, expense_date } = expenseData;
    // Define the SQL query to insert a new expense record into the expenses table
    const sql = 'INSERT INTO expenses (company_id, title, description, category, amount, payment_method, expense_date, created_by_user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    // Execute the query using the pool, passing parameters to prevent SQL injection attacks
    const [result] = await pool.query(sql, [companyId, title, description, category, amount, payment_method, expense_date, userId]);
    // Return the auto-generated ID of the newly created expense record to the controller
    return result.insertId;
};

/**
 * Service to fetch paginated expenses for a specific company.
 */
const getCompanyExpenses = async (companyId, limit, offset) => {
    // Define the SQL query to select all fields for expenses belonging to the user's company
    // We order by expense_date descending to show the most recent expenses first
    // We use LIMIT and OFFSET clauses to implement database-level pagination
    const sql = 'SELECT * FROM expenses WHERE company_id = ? ORDER BY expense_date DESC LIMIT ? OFFSET ?';
    // Execute the query and wait for the rows to be returned from the database
    const [rows] = await pool.query(sql, [companyId, parseInt(limit), parseInt(offset)]);
    // Return the array of expense objects to the controller for the response
    return rows;
};

/**
 * Service to get a single expense by ID, ensuring it belongs to the company.
 */
const getExpenseById = async (expenseId, companyId) => {
    // Define the SQL query to find a specific expense by its ID
    // We also check company_id to ensure a user cannot access another company's data by guessing IDs
    const sql = 'SELECT * FROM expenses WHERE id = ? AND company_id = ?';
    // Execute the query and capture the result
    const [rows] = await pool.query(sql, [expenseId, companyId]);
    // Return the first match if found, or null if no record matches the criteria
    return rows[0] || null;
};

/**
 * Service to delete an expense by ID and company ID.
 */
const deleteExpense = async (expenseId, companyId) => {
    // Define the SQL query to remove an expense record from the database
    // We include company_id in the WHERE clause for strict data isolation
    const sql = 'DELETE FROM expenses WHERE id = ? AND company_id = ?';
    // Execute the deletion and capture the metadata result
    const [result] = await pool.query(sql, [expenseId, companyId]);
    // Return true if at least one row was affected (deleted), otherwise return false
    return result.affectedRows > 0;
};

// Export the service functions so they can be imported and used by the controller
module.exports = {
    // Export create function
    createExpense,
    // Export list function
    getCompanyExpenses,
    // Export detail function
    getExpenseById,
    // Export delete function
    deleteExpense
};
