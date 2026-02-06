const mongoose = require('mongoose');

 
const MeetingSchema = new mongoose.Schema({
  meetingId: { type: String, required: true },
  meetingLink: { type: String, required: true },
  title: { type: String, required: true },   // 👈 added
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  role: { type: String, enum: ["host", "participant"], required: true }
}, { _id: false });
 

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    mobile: {
      type: Number,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    // role: {
    //   type: String,
    //   enum: [
    //     'super_admin',
    //     'state_admin',
    //     'district_collector',
    //     'joint_collector',
    //     'department_head',
    //     'nodal_officer',
    //     'mandal_officer',
    //     'section_officer',
    //     'data_entry_operator',
    //     'auditor',
    //     'viewer'
    //   ],
    //   default: 'data_entry_operator'
    // },
    resetOtp: {
      type: String, // stores OTP
    },
    resetOtpExpiry: {
      type: Date, // stores OTP expiry time
    },
    meetings: [MeetingSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
