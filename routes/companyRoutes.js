const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');

/**
 * Route to get all companies.
 * GET /api/companies
 */
router.get('/', companyController.getCompanies);

/**
 * Route to create a new company.
 * POST /api/companies
 */
router.post('/', companyController.createNewCompany);

module.exports = router;
