const jwt = require('jsonwebtoken'); //for creating and verifying jwt
const jwt_key = process.env.JWT_KEY; // secret key for json web token used for aunthentication
const User = require('../src/models/Schema');
const transporter = require('../utilities/transporter');
require('dotenv').config();

const forgot_pass = async (req, res) =>{
    const {email} = req.body;
    if(!email){
        return res.status(400).json({message: "Email required"});
    }
    const checkEmail = await User.findOne({email});
    if(!checkEmail)
        return res.status(400).json({message: "Email not found. Enter a valid email"});

    let reset_token;
    //creating a json web token
    try{
        reset_token = jwt.sign({id: checkEmail._id, email: checkEmail.email}, jwt_key,{expiresIn: '1h'});
        console.log(`Token generated: ${reset_token}`);
    }
    catch(error){
        console.log("Error while generating token: ",error);
        return res.status(500).json({message: "Error while generating token"});
    }

     //sending reset email
     const currentURI = process.env.RESET_URI;
     const mailOptions = {
        from : process.env.AUTH_EMAIL,
        to : email,
        subject : "Reset password",
        html : `<p>You have requested for reset password. To confirm, click on the link given below.</p><br><p><a href ="${currentURI}${reset_token}">Reset Password</a></p><br><p><b>This link will expire in 1 hour</b></p>`
     };
     transporter.sendMail(mailOptions)
     .then(()=>{
        console.log("Reset password verification email sent.");
        res.status(202).json({message: "Reset password verification email sent.Verification pending."});
    })
    .catch((error)=>{
        console.log("error");
        return res.status(500).json({message: "Reset pass verification email failed"});
    });
};

module.exports = forgot_pass;
