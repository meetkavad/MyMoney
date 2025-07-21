import express from "express";
import { authenticateToken } from "../Middleware/authorization.js";
import {
  PostUserSignup,
  PostEmailVerification,
} from "../Controller/signup.controller.js";
import {
  PostUserLogin,
  PostForgotPassword,
  PostResetPassword,
} from "../Controller/login.controller.js";

export const authRouter = express.Router();

authRouter.route("/signup").post(PostUserSignup);
authRouter.route("/postcode").post(authenticateToken, PostEmailVerification);

authRouter.route("/login").post(PostUserLogin);
authRouter.route("/forgotPassword").post(PostForgotPassword);
authRouter.route("/resetPassword").post(authenticateToken, PostResetPassword);
