// require("dotenv").config();
const nodemailer = require("nodemailer");
const data = require("../constants/service");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: data.GMAIL_USER,
    pass: data.GMAIL_PASS,
  },
});

const sendMail = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: data.GMAIL_USER,
      to,
      subject,
      text,
    });
    console.log(`Mail sent to ${to}`);
  } catch (error) {
    console.error("Nodemailer Error:", error.response || error);
    throw new Error("Could not send email");
  }
};

module.exports = sendMail;
