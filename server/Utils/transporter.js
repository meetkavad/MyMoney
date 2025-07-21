import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Nodemailer setup
export const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.MAIL_ID,
    pass: process.env.MAIL_PASSWORD,
  },
});
