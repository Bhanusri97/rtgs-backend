// messages.js

const Messages = {
  // Registration
  USER_ALREADY_EXISTS: "Email is already registered",
  USER_REGISTERED: "User registered successfully",

  // Login
  USER_LOGIN_SUCCESS: "Login successful",
  INVALID_CREDENTIALS: "Invalid email or password",
  MISSING_FIELDS: "All required fields must be provided",

  // Forgot Password / OTP
  OTP_SENT: "OTP has been sent to your email",
  OTP_INVALID: "Invalid OTP",
  OTP_EXPIRED: "OTP has expired",
  EMAIL_NOT_FOUND: "Email not registered",

  // Reset Password
  PASSWORD_RESET_SUCCESS: "Password reset successfully",

  // General
  SERVER_ERROR: "Server error",
};

module.exports = Messages;
