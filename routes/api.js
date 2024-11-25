const express = require('express');
const router = express.Router(); //for handling and managing different routes
const bcrypt = require('bcryptjs'); //for hashing the entered passwords
const nodemailer = require('nodemailer');
const {v4 : uuidv4} = require('uuid');
require('dotenv').config();

const User = require('../src/models/Schema');
const UserVerification = require('../src/models/userVerification'); //mongodb user verification model
const connectDb = require('.././mongodb');

//nodemailer transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth:{
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASS
    }
});

transporter.verify((error, success) =>{
    if(error){
        console.log("error");
    }
    else
    console.log("ready for messages");
})

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
}
 
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
        const hashedPass = await bcrypt.hash(password, 10);
        const newUser = new User({name, email, password: hashedPass, verified: false});


        await newUser.save();
        // res.status(201).json({message:"User sign up successful"});
        sendVerificationEmail(result, res);
    }
    catch(error){
        console.error(error);
        res.status(500).json({message: "Server error"});
    }
});

const sendVerificationEmail = ({_id, email},res)=>{
    const currentURI = 'http://localhost:4000/signup';
    const uniqueString = uuidv4() + _id;
    const mailOptions = {
        from: process.env.AUTH_EMAIL,
        to: email,
        subject: "Verify your email",
        html: `<p>Verify your email account to complete the signup process and login to your account.</p><p>This link expires in 1 hour</p><p>Press <a href=${currentURI + "user/verify/" + _id + "/" + uniqueString}>here</p>`
    }
    //hashing the unique string
    bcrypt.hash(uniqueString, 10)
    .then((hashedUniqueString)=>{
        const newVerification = UserVerification({
            userId: _id,
            uniqueString: hashedUniqueString,
            creationDate: Date.now,
            expiryDate: Date.now + 3600000,
        });
        newVerification.save()
        .then(()=>{
            transporter.sendMail(mailOptions)
            .then(()=>{
                res.status(200).json({message: "Verification email sent"})
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
}

//route for the login page
router.post('/login', async (req, res) => {
    const {email, password} = req.body;
    
    if(!email || !password)
        return res.status(400).json({message: "Email and password are required"});

    try{
        const checkUser = await User.findOne({email});
        if(!checkUser)
            return res.status(400).json({message: "Invalid email "});
        
        //if the entered user details do not match any present on the database
        const isMatch = await bcrypt.compare(password, checkUser.password);
        if(!isMatch)
            return res.status(400).json({message: "Invalid email or password"});
        else
        return res.status(200).json({message: "Login successful!"});
    }
    catch(error){
        console.error(error);
        res.status(500).json({message: "Server Error"});
    }
});
module.exports = router;
