const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const port = process.env.PORT || 3000;

var increment = 0;
var users = {};

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  if (users[[socket.handshake, increment]]) {
    increment += 1;
    if (increment > 4095) {
      increment -= 4095;
    }
  }
  users[[socket.handshake, increment]] = parseInt(
    (Date.now() - 1633143905614).toString(2) + increment.toString(2),
    2
  );
  io.emit(
    "chat message",
    `System: Anonymous ${users[[socket.handshake, increment]]} has connected`
  );
  io.emit("user change", Object.keys(users).length);
  socket.on("disconnect", () => {
    io.emit(
      "chat message",
      `System: Anonymous ${
        users[[socket.handshake, increment]]
      } has disconnected`
    );
    delete users[[socket.handshake, increment]];
    io.emit("user change", Object.keys(users).length);
  });
  socket.on("chat message", (msg) => {
    io.emit(
      "chat message",
      `Anonymous ${users[[socket.handshake, increment]]}: ${msg}`
    );
  });
  socket.on("users request", () => {
    io.emit("users request", Object.values(users));
  });
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
