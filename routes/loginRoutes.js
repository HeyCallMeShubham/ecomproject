const express = require('express');



const router = express.Router();



const { login } = require('../controllers/loginController');

// POST route for login

router.post('/login', login);



module.exports = router;


