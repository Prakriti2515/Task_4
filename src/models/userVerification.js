const mongoose = require('mongoose'); //

//creating a structure for the data to be stored in the database
const verificationSchema = new mongoose.Schema({
    userId : String, //the id of the user
    uniqueString : String, // a random string for each user while verification
    creationDate : Date,
    expiryDate : Date
});
const UserVerification = mongoose.model('UserVerification', verificationSchema);
module.exports = UserVerification;