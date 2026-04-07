const express = require('express');
const router = express.Router();

const {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
} = require('../controllers/userControllers');

// GET all users
router.get('/', getUsers);

// GET user by ID (dynamic route)
router.get('/:id', getUserById);

// POST create user
router.post('/', createUser);

// PUT update user
router.put('/:id', updateUser);

// DELETE user
router.delete('/:id', deleteUser);

module.exports = router;