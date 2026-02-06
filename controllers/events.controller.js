const Event = require("../models/Event");

// GET ALL EVENTS
async function getEvents(req, res) {
  try {
    const events = await Event.find().sort({ startTime: 1 });
    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

// GET EVENT BY ID
async function getEventById(req, res) {
  try {
    const { id } = req.params;
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json(event);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

// GET EVENTS BY DAY
async function getEventsByDay(req, res) {
  try {
    const { year, month, day } = req.query;
    if (!year || !month || !day) {
      return res.status(400).json({ message: "year, month, and day are required" });
    }

    // Start and end of the day
    const startOfDay = new Date(year, month - 1, day, 0, 0, 0);
    const endOfDay = new Date(year, month - 1, day, 23, 59, 59);

    // Find events that overlap this day
    const events = await Event.find({
      startTime: { $lte: endOfDay },
      endTime: { $gte: startOfDay },
    }).sort({ startTime: 1 });

    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  getEvents,
  getEventById,
  getEventsByDay,
};
