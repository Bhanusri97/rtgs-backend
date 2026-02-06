const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    title: { type: String, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    allDay: { type: Boolean, default: false },
    location: { type: String, default: "" },
    description: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
