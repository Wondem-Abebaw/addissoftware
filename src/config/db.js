const mongoose = require("mongoose");
const logger = require("./logger");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 10,
      minPoolSize: 2,
      socketTimeoutMS: 45000,
    });

    logger.info(`MongoDB Connected: ${conn.connection.host}`);

    // Event listeners for connection health
    mongoose.connection.on("connected", () => {
      logger.info("Mongoose connected to DB");
    });

    mongoose.connection.on("error", (err) => {
      logger.error(`Mongoose connection error: ${err.message}`);
    });

    mongoose.connection.on("disconnected", () => {
      logger.warn("Mongoose disconnected from DB");
    });

    // Close connection on app termination
    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      logger.info("Mongoose connection closed due to app termination");
      process.exit(0);
    });
  } catch (error) {
    logger.error(`Database connection failed: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
