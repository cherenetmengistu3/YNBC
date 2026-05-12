// Import the database connection pool to execute SQL queries asynchronously
const pool = require('../database/db');

/**
 * Service to handle the creation of a new income record.
 */
const createIncome = async (incomeData, companyId, userId) => {
    // Destructure the required fields from the incomeData object
    const { source_name, description, amount, income_date } = incomeData;
    // Define the SQL query to insert a new income record into the database
    const sql = 'INSERT INTO income (company_id, source_name, description, amount, income_date, created_by_user_id) VALUES (?, ?, ?, ?, ?, ?)';
    // Execute the query using the pool, passing values to prevent SQL injection
    const [result] = await pool.query(sql, [companyId, source_name, description, amount, income_date, userId]);
    // Return the auto-generated ID of the newly inserted record
    return result.insertId;
};

/**
 * Service to retrieve a list of income records for a specific company with pagination.
 */
const getCompanyIncome = async (companyId, limit, offset) => {
    // Prepare the SELECT query with filtering by company_id and sorting by date
    // We use LIMIT and OFFSET to support pagination in the Android app
    const sql = 'SELECT * FROM income WHERE company_id = ? ORDER BY income_date DESC LIMIT ? OFFSET ?';
    // Execute the query and capture the resulting rows
    const [rows] = await pool.query(sql, [companyId, parseInt(limit), parseInt(offset)]);
    // Return the array of income records to the controller
    return rows;
};

/**
 * Service to get a single income record by its ID, ensuring it belongs to the user's company.
 */
const getIncomeById = async (incomeId, companyId) => {
    // Select the record where both the record ID and the company ID match (Isolation)
    const sql = 'SELECT * FROM income WHERE id = ? AND company_id = ?';
    // Execute the query and wait for the result
    const [rows] = await pool.query(sql, [incomeId, companyId]);
    // Return the matching record if it exists, otherwise return null
    return rows[0] || null;
};

/**
 * Service to delete an income record from the database.
 */
const deleteIncome = async (incomeId, companyId) => {
    // Execute the DELETE command with a company_id check to prevent unauthorized deletion
    const sql = 'DELETE FROM income WHERE id = ? AND company_id = ?';
    // Capture the result of the operation
    const [result] = await pool.query(sql, [incomeId, companyId]);
    // Return true if exactly one row was removed, otherwise false
    return result.affectedRows > 0;
};

// Export the income service functions for use in other parts of the application
module.exports = {
    // Export create income function
    createIncome,
    // Export get company income function
    getCompanyIncome,
    // Export get income by id function
    getIncomeById,
    // Export delete income function
    deleteIncome
};
