import {Server} from 'socket.io'
import http from 'http'
import express from 'express'

const app = express()
const server = http.createServer(app);

const io = new Server(server,{
    cors: {
        origin: ['http://localhost:5173', 'https://mailsync-one.vercel.app'],
        credentials: true
    }
});

let onlineUsers = new Set();

io.on("connection", (socket) => {
    console.log("A user connected");

    // Read userId from query params
    const userId = socket.handshake.query.userId;
    if (userId) {
        onlineUsers.add(userId);
        io.emit("onlineUsers", Array.from(onlineUsers)); // broadcast to everyone
    }

    // On disconnect
    socket.on("disconnect", () => {
        onlineUsers.delete(userId);
        io.emit("onlineUsers", Array.from(onlineUsers));
        console.log("A user disconnected");
    });
});

export {io, app, server}