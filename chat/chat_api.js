const io = require('../index')

const chat_socket = io.on('connection', (socket) => {
  console.log('New user connected');

  socket.on('register_user', ({ userId }) => {
    console.log(`User registered: ${userId}`)
  });

  socket.on('send_message', ({ senderId, recipientId, message }) => {
    
    console.log(`Message from ${senderId} to ${recipientId}: ${message}`);
    
    socket.emit('receive_message', { senderId, message });
   });

   socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
   });

});
module.exports = chat_socket;