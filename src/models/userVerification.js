const mongoose = require('mongoose'); //

//creating a structure for the data to be stored in the database
const verificationSchema = new mongoose.Schema({
    userId : {//the id of the user
        type: String, 
        required : true
    },
    uniqueString : { // a random string for each user while verification
        type: String,
        required: true
     }, 
    creationDate : {
        type: Date,
        default: Date.now
    },
    expiryDate : {
        type: Date
    }
});
const UserVerification = mongoose.model('UserVerification', verificationSchema);
module.exports = UserVerification;