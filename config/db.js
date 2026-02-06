const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://vvk7899:rARDubo6G2K8LXNv@rtgs-ai-assistant.ya7j3mc.mongodb.net/?appName=Rtgs-AI-Assistant");
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
};

module.exports = connectDB;
