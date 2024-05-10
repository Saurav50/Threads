import mongoose from "mongoose";

let isConnected = false;

export const connectToDB = async () => {
  mongoose.set("strictQuery", true);
  if (!process.env.MONGO_DB_URL) return console.log("MongoDB url not found");
  if (isConnected) return console.log("MongoDB already connected");
  try {
    await mongoose.connect(process.env.MONGO_DB_URL);
    isConnected = true;
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log(error);
  }
};
