const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const config = require("../config/cfg.js");

module.exports = function (server) {

  const io = new Server(server, {
    cors: {
      origin: config.appUrl,
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    console.log(`New client connected: ${socket.id} | ${socket.username}`);

    socket.on('message', ({ message }) => {
      console.log(message)
      io.emit('message', message);
    });
    
    // Listen for joining a room
    socket.on('joinRoom', (room) => {
      socket.join(room);
      console.log(`${socket.id} joined room: ${room}`);
      io.to(room).emit('message', `User ${socket.id} has joined the room ${room}`);

      socket.on('roomMessage', (message) => {
        io.to(room).emit('message', `${socket.id}: ${message}`);
      });



      socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
        io.to(room).emit('message', `User ${socket.id} has left the room`);
      });
    });
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (token) {
      jwt.verify(token, config.jwt.secret, (err, decoded) => {

        if (err) return next(new Error('Authentication error'));

        socket.username = decoded.sub.username;
        next();
      });
    } else {
      next(new Error('Authentication error'));
    }
  });
};