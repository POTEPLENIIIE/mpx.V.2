// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      default: "Гравець",
    },
    balance: {
      type: Number,
      default: 0,
    },
    avatar: {
      type: String,
      default: "default-avatar.webp",
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
