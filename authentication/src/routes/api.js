const express = require('express');
const router = express.Router(); //for handling and managing different routes
// const bcrypt = require('bcryptjs'); //for hashing the entered passwords

require('dotenv').config();

const signup = require('../../controllers/signup');
const signin = require('../../controllers/signin');
const forgot_pass = require('../../controllers/forgot_pass');
const reset = require('../../controllers/reset_pass');
const verify_otp = require('../../controllers/verify_otp');

// const User = require('../models/Schema'); //mongodb user details model
// const UserVerification = require('../models/userVerification'); //mongodb user verification model

//creating route for the signup page
router.post('/signup', signup);

//verify email
// router.get(('/signup/user/verify/:userId/:uniqueString'),async (req, res) => {
//     let {userId, uniqueString} = req.params;
//     try{
//         const result = await UserVerification.findOne({userId});
//         if(!result){
//             return res.status(500).json({message : "Account does not exist or has been verified already. Sign up or login."});
//         }
//         const {expiryDate, uniqueString: hashedUniqueString} = result;
            
//         //checking for expired unique string
//         if(new Date(expiryDate).getTime() < Date.now()) 
//         {
//             await UserVerification.deleteOne({userId});
//             await User.deleteOne({_id:userId});
//             return res.status(200).json({message: "Unique string expired. Please sign up again"});
//         }
//         const isValid = await bcrypt.compare(uniqueString, hashedUniqueString);
            
//         if(!isValid)
//         {
//             return res.status(500).json({message: "Invalid verification details passed"});
//         }
//         await User.updateOne({_id : userId}, {verified : true});
//         await UserVerification.deleteOne({userId});
//         console.log("Verified");
//         // res.send('Email verified successfully!');
//         // return res.status(200).json({message:"Verification successful"});
//         res.redirect('/schema/login');
        
//     }
//     catch(error)
//     {
//         console.log("error");
//         res.status(500).json({message: "An error occurred while checking for existing user verification record"});
//     }
// });
router.post('/enter-otp/:userId', verify_otp);
//route for the login page
router.post('/login', signin);
//request for forgot password
router.post('/forgot-password', forgot_pass);
//reset password
router.post('/reset-password/:token', reset);

module.exports = router;
