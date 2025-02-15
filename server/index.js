const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const documentRoute = require('./Routers/DocumentRouter');
const { connectDB } = require('./DAL/Connection');

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT'],
    credentials: true,
}));

const io = socketIo(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST', 'PUT'],
        credentials: true,
    },
});

// Attach io to the app
app.use((req, res, next) => {
    req.io = io; // Attach the io instance to the request
    next();
});

// Connect to MongoDB
connectDB()

app.use(express.json());

// Routes
app.use('/api/document', documentRoute);

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is listening on *:${PORT}`);
});

// Socket.IO connection handler
io.on('connection', (socket) => {
    console.log('A client connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('A client disconnected:', socket.id);
    });
});

module.exports = { io };