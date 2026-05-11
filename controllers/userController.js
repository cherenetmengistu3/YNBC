const userService = require('../services/userService');

/**
 * Controller to handle fetching all users.
 */
const getUsers = async (req, res, next) => {
    try {
        const users = await userService.getAllUsers();
        res.status(200).json({
            success: true,
            data: users
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Controller to handle user creation.
 */
const createNewUser = async (req, res, next) => {
    try {
        const userId = await userService.createUser(req.body);
        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: { userId }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getUsers,
    createNewUser
};
