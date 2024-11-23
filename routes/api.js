const express = require('express');
const router = express.Router(); 
const bcrypt = require('bcryptjs');
const User = require('.././Schema');
const connectDb = require('.././mongodb');

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

router.post('/signup', async(req,res) => {
    const {name, email, password} = req.body;
    if(!name || !email || !password){
        return res.status(400).json({message:"All fields are required"});
    }
    const validate = ValidatePass(password);
    if(validate)
        return res.status(400).json({message: "weak password"});

    try{
        const existingUser = await User.findOne({email}); 

        if(existingUser){
            return res.status(400).json({message: "Email already registered"});
        }
        const hashedPass = await bcrypt.hash(password, 10);
        const newUser = new User({name, email, password: hashedPass});
        await newUser.save();
        res.status(201).json({message:"User sign up successful"});
    }
    catch(error){
        console.error(error);
        res.status(500).json({message: "Server error"});
    }
});

router.post('/login', async (req, res) => {
    const {email, password} = req.body;
    
    if(!email || !password)
        return res.status(400).json({message: "Email and password are required"});

    try{
        const checkUser = await User.findOne({email});
        if(!checkUser)
            return res.status(400).json({message: "Invalid email "});
        
        const isMatch = await bcrypt.compare(password, checkUser.password);
        if(!isMatch)
            return res.status(400).json({message: "Invalid email or password"});
    }
    catch(error){
        console.error(error);
        res.status(500).json({message: "Server Error"});
    }
});
module.exports = router;
