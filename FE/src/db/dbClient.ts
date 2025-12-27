import mongoose from "mongoose";

// Connect to MongoDB
const mongodbURI = process.env.MONGODB_URI as string;

if (!mongodbURI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env"
  );
}

export default async function dbConnect() {
  try {
    return mongoose.connect(mongodbURI, {
      bufferCommands: false,
      dbName: process.env.NODE_ENV !== "production" ? "resume" : "resume_dev",
    });
  } catch (error) {
    throw error;
  }
}
