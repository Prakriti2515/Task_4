const User = require('../src/models/Schema')
const UserVerification = require('../src/models/userVerification');
const bcrypt = require('bcryptjs');

const verify_otp = async(req, res)=>{
    const {otp} = req.body;
    const {userId} = req.params;
    console.log(otp);
    console.log(userId);

    if(!otp)
        return res.status(400).json({message: "OTP required"});
    
    const verificationData = await UserVerification.findOne({userId});
    console.log(`${verificationData}`)
    
    if (!verificationData) 
        return res.status(400).json({ message: "OTP verification data not found" });

    // Check if OTP has expired
    const currentTime = Date.now();
    if (currentTime > verificationData.expiryDate) {
        return res.status(400).json({ message: "OTP has expired" });
    }

    console.log(`OTP saved in db: ${verificationData.OTP}`);

    const result = await bcrypt.compare(otp, verificationData.OTP);
    console.log(result); 

    if(!result)
        return res.status(400).json({message: "Invalid OTP"});
    
    await User.updateOne({_id : userId}, {verified : true});
    console.log("OTP Verified");
        return res.status(200).json({message: "OTP Verified"});
        // res.redirect('/schema/login');    
}

module.exports = verify_otp;
