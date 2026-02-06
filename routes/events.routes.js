const express = require("express");
const router = express.Router();
const { getEvents, getEventById, getEventsByDay } = require("../controllers/events.controller");

router.get("/getEvents", getEvents);
router.get("/getEventById/:id", getEventById);
router.get("/getEventsByDay", getEventsByDay);

module.exports = router;
