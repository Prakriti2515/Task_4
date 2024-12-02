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

    //creating a json web token
    const reset_token = jwt.sign({id: checkEmail._id, email: checkEmail.email}, jwt_key, {expiresIn: '1h'}, (err, token)=>{
        if(err)
            console.log("Error while generating the token");
        else
        console.log(`Token generated: ${token}`);
     });    

     //sending reset email
     const currentURI = process.env.RESET_URI;
     const mailOptions = {
        from : process.env.AUTH_EMAIL,
        to : email,
        subject : "Reset password",
        html : `<p>To reset your password, click on reset password below</p><br><p><a href = ${currentURI +'/'+reset_token}Reset Password</a></p><br><p><b>This link will expire in 1 hour</b></p>`
     };
     transporter.sendMail(mailOptions)
     .then(()=>{
        res.status(202).json({message: "Reset password verification email sent.Verification pending."});
    })
    .catch((error)=>{
        console.log("error");
        res.status(500).json({message: "Reset pass verification email failed"});
    });
};

module.exports = forgot_pass;
