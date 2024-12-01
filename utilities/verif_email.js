const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../src/models/Schema');
const UserVerification = require('../src/models/userVerification');
const {v4 : uuidv4} = require('uuid'); //to generate universally unique identifiers from v4 function of uuid package

const sendVerificationEmail = ({_id, email},res)=>{
    const currentURI = process.env.HOST_URI;
    const uniqueString = uuidv4() + _id;
    const mailOptions = {
        from: process.env.AUTH_EMAIL,
        to: email,
        subject: "Verify your email",
        html: `<p>Verify your email account to complete the signup process.</p><p>This link expires in 1 hour</p><p>Click <a href=${currentURI + "user/verify/" + _id + "/" + uniqueString}>here</a> to verify email.</p>`
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


module.exports = sendVerificationEmail;