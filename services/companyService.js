const pool = require('../database/db');

/**
 * Service to fetch all companies.
 */
const getAllCompanies = async () => {
    const [rows] = await pool.query('SELECT * FROM companies');
    return rows;
};

/**
 * Service to create a new company.
 * @param {string} companyName - The name of the company to create.
 */
const createCompany = async (companyName) => {
    const [result] = await pool.query('INSERT INTO companies (company_name) VALUES (?)', [companyName]);
    return result.insertId;
};

module.exports = {
    getAllCompanies,
    createCompany
};
