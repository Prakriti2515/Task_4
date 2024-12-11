const express = require('express');
const connectDb = require('./authentication/config/mongodb');
const router = require('./authentication/src/routes/api'); 
const vehicle = require('./rides/routes/router');
const cors = require('cors');
const {Server} = require('socket.io');
const chat_socket = require('./chat/chat_api');

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json()); 
app.use('/Schema',router);
app.use('/', vehicle);

app.use(express.urlencoded({extended: false})); //for parsing the url encoded format data

const server = http.createServer(app);

// Attach Socket.IO to the same server
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

chat_socket(io);
connectDb(); 

server.listen(port, () => {
    console.log("Port connected");
})

module.exports = {app, io};