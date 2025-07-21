import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { transporter } from "../Utils/transporter.js";
import { generateCode } from "../Utils/codeGenerator.js";
import { UserModel } from "../Model/UserModel.js";
import dotenv from "dotenv";
dotenv.config();

export const PostUserLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ "email.address": email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    } else {
      // Compare the provided password with the hashed password in the database
      const match = await bcrypt.compare(password, user.password);

      if (match) {
        // if email is not verified, return an error
        if (!user.email.is_verified) {
          return res.status(403).json({
            message: "Email not verified",
          });
        }
        // Generate JWT token
        const jwt_token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
          expiresIn: "24h",
        });

        res.status(200).json({
          message: "login successful",
          token: jwt_token,
        });
      } else {
        res.status(401).json({
          message: "Invalid credentials",
        });
      }
    }
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

export const PostForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await UserModel.findOne({ "email.address": email });

    // Check if user exists
    if (!user) {
      return res.status(404).json({
        message: "No user with this email address is found!!",
      });
    } else {
      // generate a new verification code
      const code = generateCode();
      user.email.verification_code = code;
      await user.save();

      const jwt_token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "24h",
      });

      // Sending verification email
      const mailOptions = {
        from: process.env.MAIL_ID,
        to: email,
        subject: "Forgot Password",
        text: `Your verification code is ${code}`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
          return res.status(500).json({
            message: "Internal server error",
          });
        } else {
          console.log("Email sent: " + info.response);
          res.status(200).json({
            message: "Verification code sent to your email",
            token: jwt_token,
          });
        }
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

export const PostResetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const user_id = req.user.id;
    const user = await UserModel.findById(user_id);

    // Check if user exists
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Hash the new password
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      message: "Password reset successful",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};
