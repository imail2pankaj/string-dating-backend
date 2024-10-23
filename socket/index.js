const { Server } = require("socket.io");
const { Message } = require("../models");
const jwt = require("jsonwebtoken");
const config = require("../config/cfg.js");

module.exports = function (server) {

  let onlineUsers = {};
  
  const io = new Server(server, {
    cors: {
      origin: "*",
      // origin: config.appUrl,
      // credentials: true
    }
  });

  io.on('connection', (socket) => {
    console.log(`New client connected: ${socket.id} | ${socket.username}`);
    // console.log(socket.request.headers['x-forwarded-for'] || socket.handshake.address)

    socket.on('joinChannel', ({ channel }) => {

      onlineUsers[socket.id] = socket.username;

      socket.join(channel);
      
      console.log(`${socket.id} ${socket.username} joined room: ${channel}`);

      io.emit('update-user-list', Object.values(onlineUsers));

      socket.on('roomMessage', ({ channel, channel_id, message, createdAt, user, user_id, isJoined }) => {

        if (!isJoined) {
          // Message.create({ channel_id, user_id, message })
        }
        io.to('general').emit('roomMessage', { channel, channel_id, message, createdAt, user, user_id, isJoined });
      });

      socket.on('disconnect', () => {

        delete onlineUsers[socket.id];

        console.log(`Client disconnected: ${socket.id}`);
        io.to('general').emit('roomMessage', `User ${socket.id} has left the room`);
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