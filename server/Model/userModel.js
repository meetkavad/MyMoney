import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      address: {
        type: String,
        required: true,
        unique: true,
      },
      is_verified: {
        type: Boolean,
        default: false,
      },
      verification_code: {
        type: Number,
      },
    },
    password: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
    },
    notifications: {
      type: Array,
      default: [],
    },
    gender: {
      type: String,
    },
    dob: {
      type: Date,
      default: new Date("1990-01-01"),
    },
  },
  {
    timestamps: true,
  }
);

export const UserModel = mongoose.model("UserModel", userSchema);
