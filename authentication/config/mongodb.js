require('dotenv').config(); //to load environment variables from .env file
const mongoose = require('mongoose');
const uri = process.env.MONGO_URI; //uri is saved in .env in .gitignore to keep credentials of database secure

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

