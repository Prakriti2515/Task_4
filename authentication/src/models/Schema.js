const mongoose = require('mongoose'); //

//creating a structure for the data to be stored in the database
const signUpSchema = new mongoose.Schema({
    name:{
        type : String,
        required : true,
        trim : true
    },
    email:{
        type : String,
        required : true,
        trim : true,
        lowercase : true,
        unique : true
    },
    password:{
        type : String,
        required : true
    },
    verified:{
        type : Boolean,
        default : false
    },
    role:{
        type : String,
        enum : ['driver' , 'passenger']
    }
});
const User = mongoose.model('User', signUpSchema);
module.exports = User;