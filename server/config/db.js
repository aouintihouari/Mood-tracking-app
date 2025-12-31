import mongoose from "mongoose";

const DB_URI = process.env.DB_URI;

/**
 * Connects to the MongoDB database using Mongoose
 * This is an asynchronous function that attempts to establish a connection
 * to the database with the specified URI and database name
 */
const connectDB = async () => {
  try {
    // Attempt to connect to MongoDB using the provided URI and specify the database name
    await mongoose.connect(DB_URI, { dbName: "MoodTrackingApp" });
    // Log success message with an emoji to indicate successful connection
    console.log("🔗 Connection to the database established");
  } catch (err) {
    // Log error message with an emoji if connection fails, including the error details
    console.log("💥 Connection to the database couldn't be established", err);
  }
};

export default connectDB;
