const bcrypt = require('bcryptjs');
//const User = require('../src/models/Schema');
const UserVerification = require('../src/models/userVerification');
//const {v4 : uuidv4} = require('uuid'); //to generate universally unique identifiers from v4 function of uuid package
require('dotenv').config();
const transporter = require('./transporter');

const sendVerificationEmail = async ({_id, email},res)=>{
    try{
    const generateOTP = Math.floor(100000 + Math.random() * 900000);  // generating a 6-digit OTP
    

    //const currentURI = process.env.HOST_URI;
    // const uniqueString = uuidv4() + String(_id);

    const otp = String(generateOTP);

    const mailOptions = {
        from: process.env.AUTH_EMAIL,
        to: email,
        subject: "Verify your email",
        html: `<p>Verify your email account to complete the signup process. The OTP is: <b>${otp}</b>.</p><br><p>This otp expires in 15 minutes</p>`
        //<p>Click <a href=${currentURI + "user/verify/" + _id + "/" + uniqueString}>here</a> to verify email.</p>
    }

    //hashing the otp
    const saltRounds = 10;
    const hashedOTP = await bcrypt.hash(otp, saltRounds);
    const newVerification =new UserVerification({
        userId: _id,
        OTP: hashedOTP,
        creationDate: Date.now(),
        expiryDate: Date.now() + 900000,
    });
    await newVerification.save();
    await transporter.sendMail(mailOptions);
    console.log("OTP SENT SUCCESSFULLY");
    console.log(`OTP: ${otp}`);
    res.status(202).json({message: `Verification email sent ${_id}`});
    //deleting the otp from database after 15 minutes
    setTimeout(async () => {
        await UserVerification.deleteOne({ userId: _id, expiryDate: { $lte: Date.now() } });
        console.log(`Expired OTP for user ID: ${_id} has been deleted.`);
    }, 900000);
    
    }
    catch(error){
        console.error(error);
        res.status(500).json({message: "Server error. Please try again"});
    }
};

module.exports = sendVerificationEmail;