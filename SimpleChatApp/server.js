const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatPourLesMessages = require('./utils/messages');
const bodyparser = require('body-parser');
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
} = require('./utils/users');
const route = require('../SimpleChatApp/routes/routes');

const ejs = require('ejs');

const app = express();

app.set('view engine', 'ejs');
const server = http.createServer(app);
const io = socketio(server);
app.use(bodyparser.urlencoded({extended:true}));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/',route);

const botEsteban = 'Bot Esteban';

io.on('connection', socket => {
  socket.on('joinRoom', ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    const roomName = room;

    socket.join(user.room);

    socket.emit('message', formatPourLesMessages(botEsteban, `Bienvenue dans le salon 🎉${roomName}🎉`));

    socket.broadcast
      .to(user.room)
      .emit(
        'message',
        formatPourLesMessages(botEsteban, `${user.username} a rejoint le salon, Bienvenue🎉`)
      );

      io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    });
  });

  socket.on('chatMessage', msg => {
    const user = getCurrentUser(socket.id);

        io.to(user.room).emit('message', formatPourLesMessages(user.username, msg));

  });

  socket.on('disconnect', () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        'message',
        formatPourLesMessages(botEsteban, `${user.username} a quitté le salon, à bientôt🖐`)
      );

      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    }
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
