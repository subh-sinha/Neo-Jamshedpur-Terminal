import mongoose from "mongoose";
import { JOB_CANCELLATION_TYPE, JOB_CATEGORIES, JOB_STATUS, JOB_URGENCY, VERIFICATION_STATUS } from "../constants/enums.js";

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, enum: Object.values(JOB_CATEGORIES), required: true },
    requiredSkills: [String],
    constraints: [String],
    budget: { type: Number, required: true },
    budgetType: { type: String, enum: ["fixed", "negotiable"], default: "fixed" },
    paymentType: { type: String, default: "credits" },
    locationMode: { type: String, enum: ["remote", "onsite", "hybrid"], default: "onsite" },
    locationText: String,
    sector: String,
    urgency: { type: String, enum: Object.values(JOB_URGENCY), default: JOB_URGENCY.MEDIUM },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    deadline: Date,
    status: { type: String, enum: Object.values(JOB_STATUS), default: JOB_STATUS.POSTED },
    applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: "JobApplication" }],
    selectedWorker: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    verificationState: {
      type: String,
      enum: Object.values(VERIFICATION_STATUS),
      default: VERIFICATION_STATUS.NONE
    },
    visibilityTier: { type: String, default: "standard" },
    cancellationReason: String,
    cancellationType: {
      type: String,
      enum: Object.values(JOB_CANCELLATION_TYPE)
    },
    cancelledAt: Date,
    cancelledBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    cancellationStage: {
      type: String,
      enum: Object.values(JOB_STATUS)
    },
    dispute: { type: mongoose.Schema.Types.ObjectId, ref: "Dispute" },
    completedAt: Date,
    verifiedAt: Date
  },
  { timestamps: true }
);

export const Job = mongoose.model("Job", jobSchema);
