import mongoose from "mongoose";

const pulseViewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: "PulsePost", required: true },
    viewedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

pulseViewSchema.index({ user: 1, post: 1 }, { unique: true });

export const PulseView = mongoose.model("PulseView", pulseViewSchema);
