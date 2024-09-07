import { db } from "config/prisma-client";
import app from "./app";
import { Keys } from "./config/keys";
import dotenv from "dotenv";
import http from 'http';
import { Server } from "socket.io";

dotenv.config({
  path: "./.env",
});

// Create an HTTP server using the Express app
const server = http.createServer(app);

// Set up Socket.io with the HTTP server
export const socketio = new Server(server, {
  cors: {
    origin: Keys.cors, // Adjust this based on your CORS settings
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Set up a Socket.io connection handler
socketio.on('connection', (socket) => {
  console.log(`⚡ New client connected: ${socket.id}`);
  
  socket.on('disconnect', () => {
    console.log(`❌ Client disconnected: ${socket.id}`);
  });
});

// Attach the Socket.io instance to the app object so it can be accessed in other files
app.set('socketio', socketio);

server.listen(Keys.port, () => {
  console.log(`⚙️  Server is running at port : ${Keys.port}`);
});

server.on("error", (error) => {
  console.error("Error : ", error);
  throw error;
});