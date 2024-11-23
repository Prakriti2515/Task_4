const express = require('express');
const path = require('path');
const User = require('./Schema');
const connectDb = require("./mongodb");
const apiRoutes = require('./routes/api'); 

const app = express();
const port = 4000;

app.use(express.json()); 
app.use('/Schema',apiRoutes);

app.use(express.static(path.join(__dirname, 'public'))); //use the static files from public folder on the port
app.use(express.urlencoded({extended: false})); //for parsing the url encoded format data

app.get('/login',(req,res)=>{
    res.sendFile(path.join(__dirname, 'public', 'indexLogin.html'));
});
app.get('/signup',(req,res)=>{
    res.sendFile(path.join(__dirname, 'public', 'indexSignUp.html'));
});
app.post('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'indexLogin.html')); //open the indexLogin file on the port
});

connectDb();
app.listen(port, () => {
    console.log("Port connected");
})

