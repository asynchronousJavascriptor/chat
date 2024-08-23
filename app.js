const express = require("express");
const app = express();

const http = require("http");
const server = http.createServer(app);
const socketIO = require("socket.io");
const io = socketIO(server);
const { v4: uuidv4 } = require("uuid");

const waitingusers = [];

io.on("connection", function (socket) {
  socket.on("joinroom", function () {
    if (waitingusers.length > 0) {
      let roomname = uuidv4();
      socket.join(roomname);
      waitingusers[0].join(roomname);
      waitingusers.pop();

      io.to(roomname).emit("joined");
    } else {
      waitingusers.push(socket);
    }
  });
});

app.set("view engine", "ejs");

app.get("/", function (req, res) {
  res.render("index");
});

server.listen(3000);
