require('dotenv').config({ path: './.env'});
const http = require('http');
const app = require('./app');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
const { initSocket } = require('./services/socketService');

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB successfully');
        // Create HTTP server and attach Socket.IO
        const server = http.createServer(app);
        const io = new Server(server, {
            cors: {
                origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
                methods: ['GET', 'POST']
            }
        });
        initSocket(io);

        server.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Database connection error:', err.message);
        process.exit(1); // Exit process with failure
    });
