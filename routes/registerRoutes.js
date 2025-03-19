const express = require('express');
const router = express.Router();
const { register } = require('../controllers/registerControllers'); // Controller for register

// POST route for user registration
router.post('/register', register);

module.exports = router;
