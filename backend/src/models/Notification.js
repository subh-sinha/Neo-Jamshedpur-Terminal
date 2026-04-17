import mongoose from "mongoose";
import { NOTIFICATION_CATEGORY, PRIORITY } from "../constants/enums.js";

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    category: {
      type: String,
      enum: Object.values(NOTIFICATION_CATEGORY),
      default: NOTIFICATION_CATEGORY.SYSTEM
    },
    priority: { type: String, enum: Object.values(PRIORITY), default: PRIORITY.NORMAL },
    readAt: Date,
    link: String,
    metadata: mongoose.Schema.Types.Mixed
  },
  { timestamps: true }
);

export const Notification = mongoose.model("Notification", notificationSchema);
