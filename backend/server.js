const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const http = require("http");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const connectDB = require("./config/db");
const initSocket = require("./socket");
const sanitizeInput = require("./middleware/sanitize");
const notFound = require("./middleware/notFoundMiddleware");
const errorHandler = require("./middleware/errorMiddleware");

const authRoutes = require("./routes/authRoutes");
const courseRoutes = require("./routes/courseRoutes");
const studentRoutes = require("./routes/studentRoutes");
const enrollmentRoutes = require("./routes/enrollmentRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const messageRoutes = require("./routes/messageRoutes");

const app = express();
const server = http.createServer(app);

const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(helmet());
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(sanitizeInput);
if (process.env.NODE_ENV !== "test") app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.json({ message: "EduSphere API is running" });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend is healthy",
    timestamp: new Date().toISOString(),
  });
});

// Mounted under /api/v1/* (used by the frontend) and /api/* (matches the task sheet)
app.use(["/api/v1/auth", "/api/auth"], authRoutes);
app.use(["/api/v1/courses", "/api/courses"], courseRoutes);
app.use(["/api/v1/students", "/api/students"], studentRoutes);
app.use(["/api/v1/enrollments", "/api/enrollments"], enrollmentRoutes);
app.use(["/api/v1/notifications", "/api/notifications"], notificationRoutes);
app.use(["/api/v1/messages", "/api/messages"], messageRoutes);

app.use(notFound);
app.use(errorHandler);

// Socket.IO (real-time notifications + chat); controllers reach it via req.app.get("io")
const io = initSocket(server, allowedOrigins);
app.set("io", io);

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error("Failed to start server:", err.message);
    process.exit(1);
  });
