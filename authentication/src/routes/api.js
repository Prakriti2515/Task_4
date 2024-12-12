const express = require('express');
const router = express.Router(); //for handling and managing different routes

require('dotenv').config();

const signup = require('../../controllers/signup');
const signin = require('../../controllers/signin');
const forgot_pass = require('../../controllers/forgot_pass');
const reset_pass = require('../../controllers/reset_pass');
const verify_otp = require('../../controllers/verify_otp');

//creating route for the signup page
router.post('/signup', signup);
//route for otp verification during signup 
router.post('/enter-otp/:userId', verify_otp);
//route for the login page
router.post('/login', signin);
//request for forgot password
router.post('/forgot-password', forgot_pass);
//reset password
router.post('/reset-password/:token', reset_pass);

module.exports = router;
