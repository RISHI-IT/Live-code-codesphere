const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

const rooms = {}; // Store room data

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Join a room
    socket.on('joinRoom', (room) => {
        socket.join(room);

        if (!rooms[room]) {
            rooms[room] = { html: '', css: '', js: '' };
        }

        socket.emit('codeUpdate', rooms[room]);
        console.log(`User ${socket.id} joined room: ${room}`);
    });

    // Handle code changes
    socket.on('codeChange', ({ room, html, css, js }) => {
        if (rooms[room]) {
            rooms[room].html = html;
            rooms[room].css = css;
            rooms[room].js = js;
            socket.to(room).emit('codeUpdate', { html, css, js });
        }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log(`User disconnected:${socket.id}`);
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});