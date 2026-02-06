const User = require("../models/user");
const bcrypt = require("bcryptjs");
const Messages = require("../messages/messages");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/mailer");
const { generateOtp } = require("../utils/generateOtp");

//--------signup----------
exports.signup = async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;

    // check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: "error",
        messages: [Messages.USER_ALREADY_EXISTS],
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const user = await User.create({
      name,
      email,
      mobile,
      password: hashedPassword,
    //   role,
    });

    res.status(201).json({
      status: "success",
      messages: [Messages.USER_REGISTERED],
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        // role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      messages: [Messages.SERVER_ERROR],
      error: error.message,
    });
  }
};

// ----------Signin-------------
exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        status: "error",
        messages: [Messages.INVALID_CREDENTIALS],
      });
    }

    // check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        status: "error",
        messages: [Messages.INVALID_CREDENTIALS],
      });
    }

    // generate JWT token
    const token = jwt.sign({ id: user._id }, "rtgs_secret", {
      expiresIn: "1d",
    });

    res.status(200).json({
      status: "success",
      statusCode: 200,
      messages: [Messages.USER_LOGIN_SUCCESS],
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        // role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      messages: [Messages.SERVER_ERROR],
      error: error.message,
    });
  }
};

// ------------forgetPassword------------
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ status: "error", messages: [Messages.MISSING_FIELDS] });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ status: "error", messages: [Messages.INVALID_CREDENTIALS] });
    }

    const otp = generateOtp();
    const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    user.resetOtp = otp;
    user.resetOtpExpiry = expiry;
    await user.save();

    await sendMail(
      email,
      "Your OTP for Password Reset",
      `Hello ${user.name || ""
      },\n\nYour OTP is: ${otp}. It is valid for 10 minutes.\n\nThank you!`
    );

    res.status(200).json({
      status: "success",
      statusCode: 200,
      messages: [Messages.OTP_SENT],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      messages: [Messages.SERVER_ERROR],
      error: error.message,
    });
  }
};

// -----------resetPassword------------
exports.resetPassword = async (req, res) => {
  try {
    const { email, oldPassword, newPassword, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        status: "error",
        messages: [Messages.EMAIL_NOT_FOUND],
      });
    }

    const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordMatch) {
      return res.status(400).json({
        status: "error",
        messages: [Messages.INVALID_CREDENTIALS],
      });
    }

    if (user.resetOtp !== otp) {
      return res.status(400).json({
        status: "error",
        messages: [Messages.OTP_INVALID],
      });
    }

    if (!user.resetOtpExpiry || user.resetOtpExpiry < new Date()) {
      return res.status(400).json({
        status: "error",
        messages: [Messages.OTP_EXPIRED],
      });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    user.resetOtp = null;
    user.resetOtpExpiry = null;

    await user.save();

    res.status(200).json({
      status: "success",
      statusCode: 200,
      messages: [Messages.PASSWORD_RESET_SUCCESS],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      messages: [Messages.SERVER_ERROR],
      error: error.message,
    });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    // console.log(users, "users=============");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

