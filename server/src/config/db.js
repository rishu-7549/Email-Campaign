import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/email-campaign-builder";
    console.log("Connecting to MongoDB:", mongoUri);
    await mongoose.connect(mongoUri);
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB Connection Failed:", err);
    console.log("Make sure MongoDB is running on your system");
    console.log("You can install MongoDB locally or use MongoDB Atlas");
    process.exit(1);
  }
};
