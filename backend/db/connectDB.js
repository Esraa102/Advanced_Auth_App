import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected To DB");
  } catch (error) {
    console.log("Errorin connectDB()", error);
    process.exit(1);
  }
};
