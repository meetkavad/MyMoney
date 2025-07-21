import { UserModel } from "../Model/UserModel.js";
import bcrypt from "bcrypt"; // for hashing password
import jwt from "jsonwebtoken";
import { transporter } from "../Utils/transporter.js";
import { generateCode } from "../Utils/codeGenerator.js";
import dotenv from "dotenv";
dotenv.config();

export const PostUserSignup = async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await UserModel.findOne({
    "email.address": email,
  });

  //Checking if user already exists :
  if (existingUser) {
    return res.status(409).json({
      message: "Account already exists",
    });
  }

  //Hashing password :
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    const user = await UserModel.create({
      name: name,
      "email.address": email,
      password: hashedPassword,
    });

    // If user is created successfully, generate JWT token and send verification email
    const jwt_token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    const email_code = generateCode();
    user.email.verification_code = email_code;
    await user.save();

    // Sending verification email :
    const mailOptions = {
      from: process.env.MAIL_ID,
      to: email,
      subject: "MyMoney Email Verification",
      html: ` <div class="container">
                <h1>MyMoney Email Verification</h1>
                <p>Hello ${name}</p>
                <p>Below is your code for Email verification : </p>
                <p>${email_code}</p>
                <p>If you didn't request email Authentication, feel free to ignore this email.</p>
                <div class="footer">
                    <p>All Rights Reserved @MyMoney_2025</p>
                </div> `,
    };

    transporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        // Attempt to delete the user :
        await UserModel.findOneAndDelete({
          "email.address": email,
        });

        return res.status(500).json({
          error: "Email could not be sent , Provide a valid email address!",
        });
      }

      //Final Response on success :
      res.json({
        message: "Email sent for verification",
        token: jwt_token,
        info: user,
      });
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

export const PostEmailVerification = async (req, res) => {
  try {
    let { email_code } = req.body;
    email_code = Number(email_code);

    const user_id = req.user.id;

    const user = await UserModel.findById(user_id);

    // Check if user exists
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // mark email as verified if the code matches
    if (email_code === user.email.verification_code) {
      user.email.is_verified = true;
      await user.save();
      res.status(200).json({
        message: "Email Verified",
      });
    } else {
      console.log(user.email.verification_code);
      // Attempt to delete the user :
      await UserModel.deleteOne({ _id: user_id });

      res.status(400).json({
        message: "Invalid Code",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};
