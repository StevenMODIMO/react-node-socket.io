require("dotenv").config();
const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});


// listen for connections from the client
io.on("connection", (socket) => {
  console.log(`User ${socket.id} connected`);

  // listen for a room connection
  socket.on("join_room", (data) => {
    socket.join(data);
  });

  // listen for events from the client
  socket.on("send_message", (data) => {
    // send received event to other all clients
    socket.to(data.room).emit("received_message", data);
  });
});

server.listen(process.env.PORT, () => {
  console.log(`http://localhost:${process.env.PORT}`);
});
