// models/User.js

import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    // --- Fields for Google OAuth ---
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    displayName: {
      type: String,
    },
    image: {
      type: String,
    },

    email: {
      type: String,
      required: true,
      unique: true, // Email must be unique across all users
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: false,
    },

    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    username: {
      type: String,
      unique: true,
      trim: true,
      sparse: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

const User = mongoose.model("User", userSchema);

export default User;
