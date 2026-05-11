const companyService = require('../services/companyService');

/**
 * Controller to handle fetching all companies.
 */
const getCompanies = async (req, res, next) => {
    try {
        const companies = await companyService.getAllCompanies();
        res.status(200).json({
            success: true,
            data: companies
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Controller to handle company creation.
 */
const createNewCompany = async (req, res, next) => {
    try {
        const { company_name } = req.body;
        const companyId = await companyService.createCompany(company_name);
        res.status(201).json({
            success: true,
            message: 'Company created successfully',
            data: { companyId }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getCompanies,
    createNewCompany
};
