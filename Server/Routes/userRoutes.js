const express = require('express');
const router = express.Router();
const authenticate = require('../Middleware/authentication');
const userController=require('../Controller/userController');

// Create a new user
router.post('/register', userController.registerUser);


//login a user
router.post('/login',authenticate, userController.loginUser);


module.exports = router;
