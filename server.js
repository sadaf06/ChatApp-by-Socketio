const express = require('express');
const socketIO = require('socket.io');

const PORT = process.env.PORT || 3000 ;
const INDEX = '/index.html';
const server = express()
  .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const io = socketIO(server);
let users ={};
io.on('connection', socket => {
    socket.on('new-user', name => {
        // console.log('new user', name);
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    })
    socket.on('receive', message => {
        socket.broadcast.emit('send', { message: message, name: users[socket.id] });
    });
    socket.on('disconnect', name => {
        socket.broadcast.emit('left', {name: users[socket.id]});
    });
    socket.on('input', typename =>{
        socket.broadcast.emit('show', typename);
    });
});
console.log('server started');