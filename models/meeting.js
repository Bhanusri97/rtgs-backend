const mongoose = require("mongoose");
 
const MeetingSchema = new mongoose.Schema({
  meetingId: { type: String, required: true },
  meetingLink: { type: String, required: true },
  title: { type: String, required: true },   // 👈 added
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  role: { type: String, enum: ["host", "participant"], required: true }
}, { _id: false });
 
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  mobile: Number,
  password: String,
 
  meetings: [MeetingSchema]   // 👈 NEW FIELD
}, { timestamps: true });
 
module.exports = mongoose.model("User", UserSchema);
 
