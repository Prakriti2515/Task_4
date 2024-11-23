require('dotenv').config(); //to load environment variables from .env file
const mongoose = require('mongoose');
const uri = process.env.MONGO_URI;

const connectDb = async() => {
    try{
        await mongoose.connect(uri);
        console.log("Mongoose db connected");
    }
    catch(err){
        console.error("Failed to connect to MongoDB");
        process.exit(1);
    }
};
module.exports = connectDb;

