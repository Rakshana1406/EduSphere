const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Message = require("./models/Message");
const User = require("./models/User");

function initSocket(httpServer, allowedOrigins) {
  const io = new Server(httpServer, {
    cors: { origin: allowedOrigins, credentials: true },
  });

  // Only logged-in users (valid JWT) may connect
  io.use((socket, next) => {
    const token = socket.handshake.auth && socket.handshake.auth.token;
    if (!token) return next(new Error("Unauthorized"));
    try {
      socket.user = jwt.verify(token, process.env.JWT_SECRET);
      next();
    } catch (err) {
      next(new Error("Unauthorized"));
    }
  });

  const online = new Map(); // userId -> number of open sockets (tabs)

  io.on("connection", (socket) => {
    const userId = socket.user.sub;
    socket.join(`user:${userId}`);

    online.set(userId, (online.get(userId) || 0) + 1);
    socket.emit("presence:list", [...online.keys()]);
    socket.broadcast.emit("presence", { userId, online: true });

    socket.on("chat:send", async (payload, ack) => {
      try {
        const { to, text } = payload || {};
        const cleanText = typeof text === "string" ? text.trim() : "";
        if (!mongoose.Types.ObjectId.isValid(to) || !cleanText || cleanText.length > 1000) {
          throw new Error("Invalid message");
        }
        if (!(await User.exists({ _id: to }))) throw new Error("Recipient not found");

        const message = await Message.create({ from: userId, to, text: cleanText });
        const data = message.toJSON();
        // deliver to the receiver and to all tabs of the sender
        io.to(`user:${to}`).to(`user:${userId}`).emit("chat:message", data);
        if (typeof ack === "function") ack({ ok: true, message: data });
      } catch (err) {
        if (typeof ack === "function") ack({ ok: false, error: err.message });
      }
    });

    socket.on("chat:typing", ({ to } = {}) => {
      if (mongoose.Types.ObjectId.isValid(to)) io.to(`user:${to}`).emit("chat:typing", { from: userId });
    });

    socket.on("disconnect", () => {
      const left = (online.get(userId) || 1) - 1;
      if (left <= 0) {
        online.delete(userId);
        io.emit("presence", { userId, online: false });
      } else {
        online.set(userId, left);
      }
    });
  });

  return io;
}

module.exports = initSocket;
