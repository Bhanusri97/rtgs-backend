const express = require("express");
const axios = require("axios");
const router = express.Router();
const constants = require("../constants/service");
const User = require("../models/user");
const webexCalls = require("../controllers/webexController");

router.post("/create-meeting", async (req, res) => {
  try {
    const { hostUserId, participantUserId, title, startTime } = req.body;
    if (!title || !startTime) {
      return res
        .status(400)
        .json({ message: "Title and startTime are required" });
    }
    const hostUser = await User.findById(hostUserId);
    const participantUser = await User.findById(participantUserId);
    if (!hostUser || !participantUser) {
      return res.status(404).json({ message: "User not found" });
    }
    // Parse start time
    const meetingStartTime = new Date(startTime);
    if (isNaN(meetingStartTime.getTime())) {
      return res.status(400).json({ message: "Invalid startTime format" });
    }
    // Add 30 minutes
    const meetingEndTime = new Date(
      meetingStartTime.getTime() + 30 * 60 * 1000,
    );
    // Create Webex meeting (NO invitees)
    const response = await axios.post(
      "https://webexapis.com/v1/meetings",
      {
        title,
        start: meetingStartTime.toISOString(),
        end: meetingEndTime.toISOString(),
      },
      {
        headers: {
          Authorization: `Bearer ${constants.WEBEX_TOKEN}`,
          "Content-Type": "application/json",
        },
      },
    );
    const { id: meetingId, webLink } = response.data;
    const meetingData = {
      meetingId,
      meetingLink: webLink,
      title,
      startTime: meetingStartTime,
      endTime: meetingEndTime,
    };
    hostUser.meetings.push({ ...meetingData, role: "host" });
    participantUser.meetings.push({ ...meetingData, role: "participant" });
    await hostUser.save();
    await participantUser.save();
    res.status(201).json({
      message: "Meeting created successfully",
      meetingId,
      meetingLink: webLink,
    });
  } catch (err) {
    console.error("FULL ERROR:", err.response?.data);
    return res.status(err.response?.status || 500).json({
      error: err.response?.data,
    });
  }
});

router.post("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "User fetched successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        meetings: user.meetings,
      },
    });
  } catch (error) {
    console.error("Get User Error:", error.message);
    res.status(500).json({
      error: "Internal server error",
    });
  }
});

router.post("/audioCall", webexCalls.createWebexMeeting);

router.get("/webexLogin", (req, res) => {
  const authUrl =
    `https://webexapis.com/v1/authorize` +
    `?client_id=${constants.CLIENT_ID}` +
    `&response_type=code` +
    `&redirect_uri=${constants.REDIRECT_URI}` +
    `&scope=spark:all`;

  res.redirect(authUrl);
});

router.get("/webex/callback", (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send("Authorization code missing");
  }

  const userAgent = req.headers["user-agent"] || "";

  //Mobile (Expo / React Native)
  if (userAgent.includes("Android") || userAgent.includes("iPhone")) {
    return res.redirect(`myapp://webex?code=${code}`);
  }

  //Web
  return res.redirect(`http://localhost:19006/webex-login?code=${code}`);
});

router.post("/authWebex/token", async (req, res) => {
  const { code } = req.body;
  try {
    const response = await axios.post(
      "https://webexapis.com/v1/access_token",
      new URLSearchParams({
        grant_type: "authorization_code",
        client_id: constants.CLIENT_ID,
        client_secret: constants.CLIENT_SECRET,
        code,
        redirect_uri: constants.REDIRECT_URI,
      }),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      },
    );

    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/createMeeting", async (req, res) => {
  const { accessToken } = req.body;

  try {
    const response = await axios.post(
      "https://webexapis.com/v1/meetings",
      {
        title: "Webex Audio Call",
        start: "2026-02-05T10:00:00Z",
        end: "2026-02-05T10:30:00Z",
        timezone: "Asia/Kolkata"
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json(response.data);
  } catch (err) {
    console.log(err.response?.data);   // VERY IMPORTANT
    res.status(500).json({ error: err.response?.data || err.message });
  }
});


module.exports = router;
