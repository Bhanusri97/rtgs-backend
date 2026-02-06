const yup = require("yup");

// const allowedRoles = [
//   "super_admin",
//   "state_admin",
//   "district_collector",
//   "joint_collector",
//   "department_head",
//   "nodal_officer",
//   "mandal_officer",
//   "section_officer",
//   "data_entry_operator",
//   "auditor",
//   "viewer",
// ];

const signupSchema = yup.object({
  name: yup
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters")
    .max(100, "Name must not exceed 100 characters")
    .matches(/^[a-zA-Z\s]+$/, "Name can contain only letters and spaces")
    .required("Name is required"),

  email: yup
    .string()
    .trim()
    .lowercase()
    .email("Invalid email format")
    .max(255, "Email must not exceed 255 characters")
    .required("Email is required"),

  mobile: yup
    .string()
    .matches(/^[6-9]\d{9}$/, "Mobile number must be exactly 10 digits")
    .required("Mobile number is required"),

  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password must not exceed 100 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password must contain at least one special character"
    )
    .required("Password is required"),

//   role: yup
//     .string()
//     .oneOf(allowedRoles, "Invalid role")
//     .required("Role is required"),
});

const signinSchema = yup.object({
  email: yup
    .string()
    .trim()
    .lowercase()
    .email("Invalid email format")
    .required("Email is required"),

  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const forgetPasswordSchema = yup.object({
  email: yup
    .string()
    .trim()
    .lowercase()
    .email("Invalid email format")
    .required("Email is required"),
});

const resetPasswordSchema = yup.object({
  email: yup
    .string()
    .trim()
    .lowercase()
    .email("Invalid email format")
    .max(255, "Email must not exceed 255 characters")
    .required("Email is required"),

  oldPassword: yup
    .string()
    .min(6, "Old password must be at least 6 characters")
    .max(100, "Old password must not exceed 100 characters")
    .required("Old password is required"),

  newPassword: yup
    .string()
    .min(6, "New password must be at least 6 characters")
    .max(100, "New password must not exceed 100 characters")
    .matches(/[A-Z]/, "New password must contain at least one uppercase letter")
    .matches(/[a-z]/, "New password must contain at least one lowercase letter")
    .matches(/[0-9]/, "New password must contain at least one number")
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      "New password must contain at least one special character"
    )
    .notOneOf(
      [yup.ref("oldPassword")],
      "New password must be different from old password"
    )
    .required("New password is required"),

  otp: yup
    .string()
    .matches(/^\d{6}$/, "OTP must be a 6-digit number")
    .required("OTP is required"),
});

module.exports = {
  signupSchema,
  signinSchema,
  forgetPasswordSchema,
  resetPasswordSchema
};
