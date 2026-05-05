const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const ambulances = new Map();

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("ambulance:join", (ambulanceId) => {
    socket.join(`ambulance:${ambulanceId}`);
    console.log(`Ambulance joined: ${ambulanceId}`);
  });

  socket.on("dispatcher:join", () => {
    socket.join("dispatchers");
    console.log("Dispatcher joined");
  });

  socket.on("citizen:track", (requestId) => {
    socket.join(`request:${requestId}`);
    console.log(`Citizen tracking request: ${requestId}`);
  });

  socket.on("ambulance:location", (data) => {
    const payload = {
      ambulanceId: data.ambulanceId,
      requestId: data.requestId,
      latitude: data.latitude,
      longitude: data.longitude,
      speed: data.speed || 0,
      updatedAt: new Date().toISOString(),
    };

    ambulances.set(data.ambulanceId, payload);

    io.to("dispatchers").emit("ambulance:location:update", payload);

    if (data.requestId) {
      io.to(`request:${data.requestId}`).emit(
        "ambulance:location:update",
        payload
      );
    }
  });

  socket.on("emergency:new", (data) => {
    io.to("dispatchers").emit("emergency:new", data);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

app.get("/", (req, res) => {
  res.send("PulsePath AI Realtime Server Running");
});

server.listen(4000, () => {
  console.log("Realtime server running on http://localhost:4000");
});