import mongoose from "mongoose";

export async function connectDb(uri) {
  if (!uri) {
    throw new Error("MONGODB_URI is missing. Add it to backend/.env before starting the server.");
  }
  mongoose.set("strictQuery", true);
  try {
    await mongoose.connect(uri);
  } catch (error) {
    if (String(uri).startsWith("mongodb+srv://")) {
      error.message = `MongoDB Atlas connection failed. Check that your Atlas URI is correct, the database user has access, and your current IP is allowed in Atlas Network Access. Original error: ${error.message}`;
    }
    throw error;
  }
}
