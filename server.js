const express = require("express");
const http = require("http");
const cors = require("cors");
const connectDB = require("./config/db");
const socketSetup = require("./socket");

const authRouter = require("./routes/auth.routes"); 
const eventsRouter = require("./routes/events.routes"); 
const { PORT } = require("./constants/service");
const webexRoutes = require("./routes/webex.routes");
const webexCallRoutes = require("./routes/webexCalls.routes");

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Setup Socket.IO
const attachIO = socketSetup(server);
app.use(attachIO);

// REST routes
app.use("/api/auth", authRouter);
app.use("/api/events", eventsRouter);
app.use("/api/webex", webexRoutes);

// app.use("/api/webexCalls", webexCallRoutes);

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
