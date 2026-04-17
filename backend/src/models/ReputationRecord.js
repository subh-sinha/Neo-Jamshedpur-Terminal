import mongoose from "mongoose";

const reputationRecordSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    delta: { type: Number, required: true },
    reason: { type: String, required: true },
    sourceType: String,
    sourceId: mongoose.Schema.Types.ObjectId
  },
  { timestamps: true }
);

export const ReputationRecord = mongoose.model("ReputationRecord", reputationRecordSchema);
