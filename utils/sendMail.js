const nodemailer = require("nodemailer");
const { GMAIL_USER, GMAIL_PASS } = require("../constants/service");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_PASS,
  },
});

async function sendMeetingEmail({ to, hostEmail, meetingLink, start, end }) {
  const mailOptions = {
    from: `"Webex App" <${GMAIL_USER}>`,
    to, // recipient email(s)
    subject: "Webex Meeting Invitation",
    html: `
      <h2>Webex Meeting Invitation</h2>
      <p><b>Host:</b> ${hostEmail}</p>
      <p><b>Start:</b> ${start}</p>
      <p><b>End:</b> ${end}</p>
      <p>
        <a href="${meetingLink}" target="_blank">
           Click here to join the meeting
        </a>
      </p>
    `,
  };

  await transporter.sendMail(mailOptions);
}

module.exports = sendMeetingEmail;
