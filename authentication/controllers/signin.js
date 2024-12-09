const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../src/models/Schema');
const userVerification = require('../src/models/userVerification');

const signin =  async (req, res) => {
    const {email, password} = req.body;
    
    if(!email || !password){
        return res.status(400).json({message: "Email and password are required"});
    }
    try{
        const checkUser = await User.findOne({email});
        const userId = checkUser._id;
        console.log("User ID: "+userId);
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
};

module.exports = signin;
