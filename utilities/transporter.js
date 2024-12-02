const nodemailer = require('nodemailer');


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

module.exports = transporter;