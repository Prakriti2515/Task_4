const express = require('express');
const app = express();
require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); //for creating and verifying jwt
const jwt_key = process.env.JWT_KEY; // secret key for json web token used for aunthentication
const User = require('../src/models/Schema');
const ValidatePass = require('../utilities/pass_check');
app.use(express.json());

const reset = async (req, res)=>{
    const {newPassword} = req.body;
    const {token} = req.params;
    
    const validPass = ValidatePass(newPassword);
    console.log(validPass);
    if(validPass)
        return res.status(400).json({message: "Weak password. Try changing it"});
    
    try{
        const decoded = jwt.verify(token, jwt_key);
        //token validated
        const user = await User.findById(decoded.id);
        console.log(decoded);
        if(!user){
           return res.status(404).json({message: "User not found"});
        }
        const hashedPass = await bcrypt.hash(newPassword, 10);
        user.password = hashedPass;
        await user.save();
        res.send('Password reset successfully!');
        return res.status(200).json({message: "Password reset successfully!"});
    }
    catch(error){

        if (error.name === 'TokenExpiredError') {
            return res.status(400).json({ message: 'Token has expired' });
        }
        
        console.error(error);
        return res.status(500).json({message: "Error resetting password"});
    }         
};

module.exports = reset;