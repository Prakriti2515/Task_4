const express = require('express');
const connectDb = require('./authentication/config/mongodb');
const router = require('./authentication/src/routes/api'); 
const cors = require('cors');

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json()); 
app.use('/Schema',router);

app.use(express.urlencoded({extended: false})); //for parsing the url encoded format data

connectDb(); 

app.listen(port, () => {
    console.log("Port connected");
})

