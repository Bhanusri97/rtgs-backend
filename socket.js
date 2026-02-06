const { Server } = require("socket.io");
const Event = require("./models/Event");

// Map to store online users: userId -> socket.id
const onlineUsers = new Map();

function setupSocket(server) {
  const io = new Server(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    // LOGIN
    socket.on("login", (userId) => {
      onlineUsers.set(userId, socket.id);
      console.log("User logged in:", userId, "socket:", socket.id);
    });

    // CREATE EVENT
    socket.on(
      "listenEvent",
      async (
        { userId, title, startTime, endTime, allDay, location, description },
        callback,
      ) => {
        try {
          console.log("listen event received in line 35: ", description);
          console.log("createEvent payload:", {
            userId,
            title,
            startTime,
            endTime,
            allDay,
          });

          if (!userId) {
            return callback({
              success: false,
              error: "User not authenticated",
            });
          }

          if (!title || !startTime || !endTime) {
            return callback({
              success: false,
              error: "Title, start time and end time are required",
            });
          }

          const start = new Date(startTime);
          const end = new Date(endTime);

          if (!allDay && end < start) {
            return callback({
              success: false,
              error: "End time cannot be before start time",
            });
          }

          if (allDay) {
            start.setHours(0, 0, 0, 0);
            end.setHours(23, 59, 59, 999);
          }

          const event = await Event.create({
            userId, // THIS IS THE KEY FIX
            title,
            startTime: start,
            endTime: end,
            allDay: !!allDay,
            location: location || "",
            description: description || "",
            message: "Create event is triggered from backend line 78",
          });

          console.log("Event created triggered in line 84:", event._id);

          // notify only this user (optional)
          io.emit("eventCreated", event.toObject());

          callback({ success: true, event });
        } catch (err) {
          console.error(" Error creating event:", err);
          callback({ success: false, error: "Server error" });
        }
      },
    );

    // UPDATE EVENT
    socket.on("updateEvent", async (data) => {
      try {
        const {
          eventId,
          title,
          startTime,
          endTime,
          allDay,
          location,
          description,
        } = data;

        if (!eventId) {
          return socket.emit("error", { message: "Event ID is required" });
        }

        const update = {};

        if (title !== undefined) update.title = title;
        if (startTime) update.startTime = new Date(startTime);
        if (endTime) update.endTime = new Date(endTime);
        if (allDay !== undefined) update.allDay = allDay;
        if (location !== undefined) update.location = location;
        if (description !== undefined) update.description = description;

        const updatedEvent = await Event.findByIdAndUpdate(eventId, update, {
          new: true,
        });

        if (!updatedEvent) {
          return socket.emit("error", { message: "Event not found" });
        }

        io.emit("eventUpdated", updatedEvent);
      } catch (err) {
        console.error("Error updating event:", err);
        socket.emit("error", { message: "Server error" });
      }
    });

    // DELETE EVENT
    socket.on("deleteEvent", async ({ eventId }) => {
      try {
        if (!eventId)
          return socket.emit("error", { message: "Event ID is required" });

        const deletedEvent = await Event.findByIdAndDelete(eventId);
        if (!deletedEvent)
          return socket.emit("error", { message: "Event not found" });

        // Broadcast to ALL sockets
        io.emit("eventDeleted", { id: eventId });
      } catch (err) {
        console.error("Error deleting event:", err);
        socket.emit("error", { message: "Server error" });
      }
    });

    // DISCONNECT
    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
      for (let [userId, sId] of onlineUsers.entries()) {
        if (sId === socket.id) {
          onlineUsers.delete(userId);
          console.log("User logged out:", userId);
          break;
        }
      }
    });
  });

  return (req, res, next) => {
    req.io = io;
    next();
  };
}

module.exports = setupSocket;
