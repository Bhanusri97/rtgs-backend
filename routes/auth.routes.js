const express = require('express');
const authRouter = express.Router();
const authRoutes = require("../controllers/authController");
const validate = require('../middleware/validate');
const authValidations = require('../middleware/validations');

//auth routes
authRouter.post('/signup', validate(authValidations.signupSchema), authRoutes.signup);
authRouter.post('/signin', validate(authValidations.signinSchema), authRoutes.signin);
authRouter.post('/forgetPassword', validate(authValidations.forgetPasswordSchema), authRoutes.forgotPassword);
authRouter.post('/resetPassword', validate(authValidations.resetPasswordSchema), authRoutes.resetPassword);
authRouter.get('/getUsers', authRoutes.getUsers);

module.exports = authRouter;
