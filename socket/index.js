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

    // Listen for joining a room
    socket.on('joinChannel', ({ channel }) => {

      /*if (!onlineUsers[channel]) {
        onlineUsers[channel] = {};
      }
      onlineUsers[channel][socket.id] = socket.username;*/

      onlineUsers[socket.id] = socket.username;

      socket.join(channel);
      
      console.log(`${socket.id} ${socket.username} joined room: ${channel}`);

      io.emit('update-user-list', Object.values(onlineUsers));
      // io.to(channel).emit('update-user-list', Object.values(onlineUsers[channel]));

      // io.to(channel).emit('roomMessage', `User ${socket.id} has joined the room ${channel}`);

      socket.on('roomMessage', ({ channel, channel_id, message, createdAt, user, user_id, isJoined }) => {

        // console.log({ channel, channel_id, message, time, user, user_id })
        if (!isJoined) {
          Message.create({ channel_id, user_id, message })
        }
        io.to(channel).emit('roomMessage', { channel, channel_id, message, createdAt, user, user_id, isJoined });
      });

      socket.on('disconnect', () => {

        delete onlineUsers[socket.id];
        /*for (const channel in onlineUsers) {
          if (onlineUsers[channel][socket.id]) {
            delete onlineUsers[channel][socket.id];
            io.to(channel).emit('update-user-list', Object.values(onlineUsers[channel]));
          }
        }*/

        console.log(`Client disconnected: ${socket.id}`);
        io.to(channel).emit('message', `User ${socket.id} has left the room`);
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