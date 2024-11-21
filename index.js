const express = require("express");
const app = express();
const path = require("path");

const port = 4000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/public', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'indexLogin.html'));
});

app.listen(port, () => {
    console.log("Port connected");
})

