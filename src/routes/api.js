const express = require('express');
const router = express.Router(); //for handling and managing different routes
const bcrypt = require('bcryptjs'); //for hashing the entered passwords
const nodemailer = require('nodemailer');
const {v4 : uuidv4} = require('uuid');
require('dotenv').config();

const User = require('../models/Schema');
const UserVerification = require('../models/userVerification'); //mongodb user verification model
const connectDb = require('../../mongodb');

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
        html: `<p>Verify your email account to complete the signup process.</p><p>This link expires in 1 hour</p><p>Click <a href=${currentURI + "user/verify/" + _id + "/" + uniqueString}>here to verify email.</a></p>`
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
router.get(('/verify/:userId/:uniqueString'),(req, res) => {
    let {userId, uniquestring} = req.params;
    UserVerification.find({userId})
    .then((result) => { //result is an array of matching docs
        if(result.length > 0){ 
            const {expiryDate} = result[0];
            const hashedUniqueString = result[0].uniqueString;
            
            //checking for expired unique string
            if(expiryDate < Date.now()) 
            {
                UserVerification.deleteOne({userId})
                .then((result) => {
                    User.deleteOne({_id:userId})
                    .then(()=>{
                        res.status(200).json({message: "Unique string expired. Please sign up again"})
                    })
                    .catch((error) =>{
                        console.log("error");
                        res.status(500).json({message:"Clearing the user with expired unique string failed"})
                    })
                })
                .catch((error) => {
                    console.log("error");
                    res.status(500).json({message : "Error occurred while clearing expired user verification record"})
                })
            }
            else{ //valid record exists
                bcrypt
                .compare(uniqueString, hashedUniqueString)
                .then((result)=>{

                    if(result){
                        User.updateOne({_id:userId},{verified: true})
                        .then(()=>{
                            UserVerification
                            .deleteOne({userId})
                            .then(()=>{
                                console.log("Verified");
                                res.status(201).json({message:"Verification successful"})
                            })
                            .catch((error)=>{
                                res.status(500).json({message:"Error occurred while finalizing verification"})
                            })
                        })
                        .catch((error)=>{
                            res.status(500).json({message:"Error occurred while updating user record"})
                        })

                    }
                    else{
                        res.status(500).json({message: "Invalid verification details passed"})
                    }
                })
                .catch((error) => {
                    res.status(500).json({message:"Error occurred while comparing unique string"})
                })
            }
        }
        else{
            //the user verification record does not exist
            res.status(500).json({message : "Account record does not exist or has been verified already. Please sign up or log in"});
        }
    })
    .catch((error) =>{
        console.log("error");
        res.status(500).json({message: "An error occurred while checking for existing user verification record"});
    })

})

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
module.exports = router;
