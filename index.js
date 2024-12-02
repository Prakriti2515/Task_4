const express = require('express');
const path = require('path');
const User = require('./src/models/Schema');
const connectDb = require("./config/mongodb");
const apiRoutes = require('./src/routes/api'); 
const cors = require('cors');

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json()); 
app.use('/Schema',apiRoutes);

app.use(express.urlencoded({extended: false})); //for parsing the url encoded format data

connectDb(); 

app.listen(port, () => {
    console.log("Port connected");
})

