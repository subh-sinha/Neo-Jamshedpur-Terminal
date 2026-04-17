import mongoose from "mongoose";
import { PRIORITY, PULSE_CATEGORY } from "../constants/enums.js";

const pulsePostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    summary: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: String, enum: Object.values(PULSE_CATEGORY), required: true },
    priority: { type: String, enum: Object.values(PRIORITY), default: PRIORITY.NORMAL },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    isOfficial: { type: Boolean, default: false },
    pinned: { type: Boolean, default: false },
    trendingScore: { type: Number, default: 0 },
    sector: String,
    location: String,
    media: [
      {
        url: String,
        type: { type: String, enum: ["image", "video"], default: "image" }
      }
    ],
    reactionsCount: { type: Number, default: 0 },
    bookmarksCount: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    verificationStatus: { type: String, enum: ["UNVERIFIED", "VERIFIED", "FLAGGED"], default: "UNVERIFIED" },
    flaggedReason: String,
    escalatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    lastEngagedAt: Date
  },
  { timestamps: true }
);

export const PulsePost = mongoose.model("PulsePost", pulsePostSchema);
