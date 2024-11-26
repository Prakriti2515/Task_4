const express = require('express');
const path = require('path');
const User = require('./src/models/Schema');
const connectDb = require("./mongodb");
const apiRoutes = require('./src/routes/api'); 

const app = express();
const port = 4000;

app.use(express.json()); 
app.use('/Schema',apiRoutes);

app.use(express.static(path.join(__dirname, 'public'))); //use the static files from public folder on the port
app.use(express.urlencoded({extended: false})); //for parsing the url encoded format data

app.get('/login',(req,res)=>{
    res.sendFile(path.join(__dirname, 'public', 'indexLogin.html')); //to receive data from user on the login page on /login route
});
app.get('/signup',(req,res)=>{
    res.sendFile(path.join(__dirname, 'public', 'indexSignUp.html')); //to receive data from user on the signup page on /signup route
});
app.post('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'indexLogin.html')); //to handle the data submitted by the user on the login page
});

connectDb(); 

app.listen(port, () => {
    console.log("Port connected");
})

