const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

/**
 * Route to get all users.
 * GET /api/users
 */
router.get('/', userController.getUsers);

/**
 * Route to create a new user.
 * POST /api/users
 */
router.post('/', userController.createNewUser);

module.exports = router;
