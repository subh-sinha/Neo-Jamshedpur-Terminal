import mongoose from "mongoose";

const reactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: "PulsePost", required: true },
    type: { type: String, enum: ["signal", "support", "watching", "amplify"], default: "signal" }
  },
  { timestamps: true }
);

reactionSchema.index({ user: 1, post: 1 }, { unique: true });

export const Reaction = mongoose.model("Reaction", reactionSchema);
