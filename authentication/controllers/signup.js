const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../src/models/Schema');
const sendVerificationEmail = require('../utilities/verif_email');
const ValidatePass = require('../utilities/pass_check'); //criteria for a password

const signup = async(req,res) => {
    const {name, email, password} = req.body;
    if(!name || !email || !password){
        return res.status(400).json({message:"All fields are required"});
    }
    const validate = ValidatePass(password);
    if(validate)
        return res.status(400).json({message: "Weak password. Try changing it"});

    try{
        const existingUser = await User.findOne({email}); 
        if(existingUser && existingUser.verified == true){
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
};

module.exports = signup;