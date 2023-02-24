const express = require('express');
const app = express();
const generateID = () => Math.random().toString(36).substring(2, 10);
const PORT = process.env.PORT || 3000;
app.use(express.urlencoded({extended: true}));
app.use(express.json());
const http = require('http').Server(app);
const cors = require('cors');
app.use(cors());

const io = require('socket.io')(http, {
  cors: {
    origin: '<http://localhost:4000>',
  },
});

io.on('connection', client => {
  console.log(`⚡: ${client.id} user just connected!`);
  client.on('send message', (data) => {
    console.log(data);
    io.emit('receive message', data);
    // client.broadcast.to(message.recieverId).emit( 'message',`${obj}`);
  });
  client.on( 'new_notification', function(data) {
    console.log(data.message);
    io.sockets.emit( 'show_notification', { 
      message: data 
    });
  });

  client.on('disconnect', () => {
    console.log('user disconnected');
  });
  
});
app.get('/', (req, res) => {
  res.json({
    message: 'Hello socket',
  });
});
http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
