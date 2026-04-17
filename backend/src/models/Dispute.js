import mongoose from "mongoose";
import { DISPUTE_STATUS } from "../constants/enums.js";

const disputeSchema = new mongoose.Schema(
  {
    entityType: { type: String, enum: ["job", "trade"], required: true },
    entityId: { type: mongoose.Schema.Types.ObjectId, required: true },
    openedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    againstUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    reason: { type: String, required: true },
    status: { type: String, enum: Object.values(DISPUTE_STATUS), default: DISPUTE_STATUS.OPEN },
    resolution: String,
    resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

export const Dispute = mongoose.model("Dispute", disputeSchema);
