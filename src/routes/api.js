const express = require('express');
const router = express.Router(); //for handling and managing different routes
const bcrypt = require('bcryptjs'); //for hashing the entered passwords
const nodemailer = require('nodemailer');
const {v4 : uuidv4} = require('uuid');
const jwt = require('jsonwebtoken'); //for creating and verifying jwt

require('dotenv').config();

const User = require('../models/Schema');
const UserVerification = require('../models/userVerification'); //mongodb user verification model
const connectDb = require('../../config/mongodb');
const jwt_key = process.env.JWT_KEY; 

//nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASS
    }
});

transporter.verify((error, success) =>{
    if(error){
        console.log('SMTP connection failed:', error);
    }
    else{
        console.log('SMTP connection successful:', success);
    }
});

//criteria for a password
const ValidatePass = (password) => {
    const minlength = 8;
    const maxlength = 20;
    const lowercase = /[a-z]/;
    const uppercase = /[A-Z]/;
    const numbers = /\d/;
    const specialChar = /[!@#$%^&*(),.?":{}|<>]/;
    
    if(password.length < 8)
        return 'Too short password';
    else if(password.length > 20)
        return 'Too long password';
    else if(!lowercase.test(password))
        return 'No uppercase characters';
    else if(!uppercase.test(password))
        return 'No lowercase characters';
    else if(!specialChar.test(password))
        return 'No special characters used';
    else if(!numbers.test(password))
        return 'No digits present in the password';
    else
    return null;
};
 
//creating route for the signup page
router.post('/signup', async(req,res) => {
    const {name, email, password} = req.body;
    if(!name || !email || !password){
        return res.status(400).json({message:"All fields are required"});
    }
    const validate = ValidatePass(password);
    if(validate)
        return res.status(400).json({message: "Weak password. Try changing it"});

    try{
        const existingUser = await User.findOne({email}); 
        if(existingUser){
            return res.status(400).json({message: "Email already registered"});
        }

        //hashing the password in the database
        const saltRounds = 10;
        const hashedPass = await bcrypt.hash(password, saltRounds);
        const newUser = new User({name, email, password: hashedPass, verified: false});
        
        const result = await newUser.save();
        console.log("ID saved. Ready to send verification email.");
        sendVerificationEmail(result, res);        
    }
    catch(error){
        console.error(error);
        res.status(500).json({message: "Server error"});
    }
});

const sendVerificationEmail = ({_id, email},res)=>{
    const currentURI = process.env.HOST_URI;
    const uniqueString = uuidv4() + _id;
    const mailOptions = {
        from: process.env.AUTH_EMAIL,
        to: email,
        subject: "Verify your email",
        html: `<p>Verify your email account to complete the signup process.</p><p>This link expires in 1 hour</p><p>Click <a href=${currentURI + "user/verify/" + _id + "/" + uniqueString}>here</a> to verify email.</p>`
    }
    //hashing the unique string
    const saltRounds = 10;
    bcrypt
    .hash(uniqueString, saltRounds)
    .then((hashedUniqueString)=>{
        const newVerification = UserVerification({
            userId: _id,
            uniqueString: hashedUniqueString,
            creationDate: Date.now(),
            expiryDate: Date.now() + 3600000,
        });
        newVerification.save()
        .then(()=>{
            transporter.sendMail(mailOptions)
            .then(()=>{
                res.status(202).json({message: "Verification email sent.Verification pending."})
            })
            .catch((error)=>{
                console.log("error");
                res.status(500).json({message: "Verification email failed"})
            })

        })
        .catch((error) => {
            console.log("error");
            res.status(500).json({message: "Can't save verification data"});            
        })
    }).catch(() =>{
        res.status(500).json({message: "server error"});
    })
};
//verify email
router.get(('/verify/:userId/:uniqueString'),async (req, res) => {
    let {userId, uniqueString} = req.params;
    try{
        const result = await UserVerification.findOne({userId});
        if(!result){
            return res.status(500).json({message : "Account does not exist or has been verified already. Sign up or login."});
        }
        const {expiryDate, uniqueString: hashedUniqueString} = result;
            
        //checking for expired unique string
        if(new Date(expiryDate).getTime() < Date.now()) 
        {
            await UserVerification.deleteOne({userId});
            await User.deleteOne({_id:userId});
            return res.status(200).json({message: "Unique string expired. Please sign up again"});
        }
        const isValid = await bcrypt.compare(uniqueString, hashedUniqueString);
            
        if(!isValid)
        {
            return res.status(500).json({message: "Invalid verification details passed"});
        }
        await User.updateOne({_id : userId}, {verified : true});
        await UserVerification.deleteOne({userId});
        console.log("Verified");
        return res.status(201).json({message:"Verification successful"});
    }
    catch(error)
    {
        console.log("error");
        res.status(500).json({message: "An error occurred while checking for existing user verification record"});
    }
});

//route for the login page
router.post('/login', async (req, res) => {
    const {email, password} = req.body;
    
    if(!email || !password){
        return res.status(400).json({message: "Email and password are required"});
    }
    try{
        const checkUser = await User.findOne({email});
        if(!checkUser) //if the entered user details do not match any present on the database
        {
            return res.status(400).json({message: "Invalid email "});
        }        
        else{
            if(!checkUser.verified)
                return res.status(400).json({message: "Email not verified. Check inbox"});
            else
            {
                const isMatch = await bcrypt.compare(password, checkUser.password);
                if(!isMatch){
                    return res.status(400).json({message: "Invalid email or password"});
                }
                else{
                    return res.status(200).json({message: "Login successful!"});
                }
            }
        }        
    }
    catch(error){
        console.error(error);
        res.status(500).json({message: "Server Error"});
    }
});

//request for forgot password
router.post('/forgot-password', async (req, res) =>{
    const {email} = req.body;

    if(!email){
        return res.status(400).json({message: "Email required"});
    }

    const checkEmail = await User.findOne({email});
    if(!checkEmail)
        return res.status(400).json({message: "Email not found. Enter a valid email"});

    //creating a json web token
    const reset_token = jwt.sign({id: checkEmail._id, email: checkEmail.email}, jwt_key, {expiresIn: '1h'}, (err, token)=>{
        if(err)
            console.log("Error while generating the token");
        else
        console.log(`Token generated: ${token}`);
     });    
     //sending reset email
     const currentURI = 'http://localhost:4000/reset-password/';
     const mailOptions = {
        from : process.env.AUTH_EMAIL,
        to : email,
        subject : "Reset password",
        html : `<p>To reset your password, click on reset password below</p><br><p><a href = ${currentURI+reset_token}</a></p><br><p>This link will expire in 1 hour</p>`
     };
     transporter.sendMail(mailOptions)
     .then(()=>{
        res.status(202).json({message: "Verification email sent.Verification pending."});
    })
    .catch((error)=>{
        console.log("error");
        res.status(500).json({message: "Verification email failed"});
    });
});
//reset password
router.post('/reset-password/:token', async (req, res)=>{
    const {token} = req.params;
    const {newPass} = req.body;

    const validPass = ValidatePass(newPass);
    if(validPass)
        return res.status(400).json({message: "Weak password. Try changing it"});
    try{
        const decoded = jwt.verify(token, jwt_key);
        
        //token validated
        const user = await User.findById(decoded._id);
        if(!user){
            res.status(404).json({message: "User not found"});
        }
        const hashedPass = await bcrypt.hash(newPass, 10);
        user.password = hashedPass;
        await user.save()
        return res.status(200).json({message: "Password reset successfully!"});
    }
    catch(error){
        console.error(error);
        return res.status(500).json({message: "Error resetting password"});
        
    }         
    });
module.exports = router;
