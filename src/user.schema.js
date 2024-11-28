import mongoose from "mongoose";
import { type } from "os";

const chatSchema = new mongoose.Schema({
  username: { type: String, required: true },
  profilepic: {
    type: String,
    default:
      "https://img.freepik.com/premium-vector/silver-membership-icon-default-avatar-profile-icon-membership-icon-social-media-user-image-vector-illustration_561158-4215.jpg?semt=ais_hybrid",
  },
  message: { type: String, required: true },
  room: { type: Number },
  createdAt: { type: Date, default: new Date() },
});

export const chatModel = mongoose.model("Chat", chatSchema);
