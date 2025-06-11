const mongoose = require("mongoose");
const logger = require("./logger");

const connectDB = async () => {
  try {
    console.log("Connecting to MongoDB..."); // TEMP debug
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 10,
      minPoolSize: 2,
      socketTimeoutMS: 45000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // logger.info(`MongoDB Connected: ${conn.connection.host}`);

    // Event listeners for connection health
    mongoose.connection.on("connected", () => {
      console.log("Mongoose connected to DB");
      // logger.info("Mongoose connected to DB");
    });

    mongoose.connection.on("error", (err) => {
      console.error("Mongoose error:", err); // TEMP debug
      // logger.error(`Mongoose connection error: ${err.message}`);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("Mongoose disconnected");
      // logger.warn("Mongoose disconnected from DB");
    });

    // Close connection on app termination
    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      console.log("Connection closed on SIGINT");
      // logger.info("Mongoose connection closed due to app termination");
      process.exit(0);
    });
  } catch (error) {
    console.error(" MongoDB connection failed:", error);
    // logger.error(`Database connection failed: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
