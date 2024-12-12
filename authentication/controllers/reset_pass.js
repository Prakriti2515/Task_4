require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); //for creating and verifying jwt
const jwt_key = process.env.JWT_KEY; // secret key for json web token used for aunthentication
const User = require('../src/models/Schema');
const ValidatePass = require('../utilities/pass_check');

const reset_pass = async (req, res)=>{
    console.log("Reset pass code is working");
    const {token} = req.params;
    const {newPassword} = req.body;
    
    const validPass = ValidatePass(newPassword);
    console.log(validPass);
    if(validPass)
        return res.status(400).json({message: "Weak password. Try changing it"});
    
    try{
        const decoded = jwt.verify(token, jwt_key);
        console.log(decoded);
        //token validated
        const user = await User.findById(decoded._id);
        console.log(user);
        if(!user){
           return res.status(404).json({message: "User not found"});
        }
        const hashedPass = await bcrypt.hash(newPassword, 10);
        console.log(hashedPass);
        user.password = hashedPass;
        await user.save()
        .then(()=>{
            console.log("Password reset successfully");
        return res.status(200).json({message: "Password reset successfully!"});
        })
        .catch((error) => {
            console.log("Error in saving password: ",error);
        });
        
    }
    catch(error){
        console.error("Error while resetting password: ", error);
        if (error.name === 'TokenExpiredError') {
            return res.status(400).json({ message: 'Token has expired' });
        }
        return res.status(500).json({message: "Error resetting password"});
    }         
};

module.exports = reset_pass;