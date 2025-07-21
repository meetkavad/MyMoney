import express from "express";
import { getProfile, updateProfile } from "../Controller/user.controller.js";
import { authenticateToken } from "../Middleware/authorization.js";
export const userRouter = express.Router();

userRouter
  .route("/profile")
  .get(authenticateToken, getProfile)
  .put(authenticateToken, updateProfile);
