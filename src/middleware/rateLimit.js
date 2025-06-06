const rateLimit = require("express-rate-limit");

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.method === "GET", // Skip for read operations
  message: "Too many requests, please try again later.",
});

const createAccountLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message:
    "Too many accounts created from this IP, please try again after an hour",
});

module.exports = {
  apiLimiter,
  createAccountLimiter,
};
