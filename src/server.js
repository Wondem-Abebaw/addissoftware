require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const connectDB = require("./config/db");
const logger = require("./config/logger");
// const globalErrorHandler = require("./middleware/errorHandler");

const app = express();
const PORT = 5000;

// Database Connection
connectDB();

// Security Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "10kb" }));

// // Data sanitization
// app.use(mongoSanitize());
// app.use(xss());
// app.use(hpp());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  message: "Too many requests from this IP, please try again later",
});
app.use("/api", limiter);

// Routes
app.use("/api/songs", require("./routes/songs"));
app.use("/api/statistics", require("./routes/statistics"));

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "API is running",
    timestamp: new Date(),
  });
});

// Error handling
// app.use(globalErrorHandler);

// Start Server
const server = app.listen(PORT, () => {
  // logger.info(`Server running on port ${PORT}`);
  console.log(`Server running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on("unhandledRejection", (err) => {
  logger.error("UNHANDLED REJECTION!  Shutting down...");
  logger.error(err.name, err.message);
  server.close(() => process.exit(1));
});

process.on("SIGTERM", () => {
  logger.info(" SIGTERM RECEIVED. Shutting down gracefully");
  server.close(() => logger.info("Process terminated!"));
});
