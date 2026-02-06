const axios = require("axios");
const constants = require("../constants/service")

async function exchangeToken(req, res) {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: "Authorization code is required" });
  }

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
      }
    );

    // Return the token data
    res.json(response.data);
    console.log(response.data, "auth token=======>>")
  } catch (err) {
    console.error("Token exchange failed:", err.message);
    res.status(500).json({ error: "Token exchange failed" });
  }
}

async function createWebexMeeting(req, res) {
  try {
    const { title, startTime, endTime } = req.body;

    const response = await axios.post(
      "https://webexapis.com/v1/meetings",
      {
        title: title || "Audio Call",
        start: startTime,
        end: endTime,
        enabledJoinBeforeHost: true,
        allowAnyUserToBeCoHost: false,
      },
      {
        headers: {
          Authorization: `Bearer ${constants.WEBEX_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Webex meeting created:", response.data.webLink);

    res.json({
      meetingId: response.data.id,
      meetingLink: response.data.webLink, // ✅ correct
    });
  } catch (error) {
    console.error(
      "Webex create meeting error:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Failed to create meeting" });
  }
}






module.exports = { exchangeToken,createWebexMeeting };
