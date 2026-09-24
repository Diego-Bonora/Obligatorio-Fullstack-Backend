import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    profilePicture: { type: String },
    rol: {
      type: String,
      enum: ["usuario", "admin"],
      default: "usuario",
    },
    plan: {
      type: String,
      enum: ["plus", "premium"],
      default: "plus",
    },
    cantidadRecetas: {
      type: Number,
      default: 0,
    },
    activo: {
      type: Boolean,
      default: true,
    },
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema, "users");

export default User;
