import mongoose from "mongoose";

const jobApplicationSchema = new mongoose.Schema(
  {
    job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    applicant: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    pitch: { type: String, required: true },
    proposedBudget: Number,
    expectedPrice: Number,
    availability: String,
    status: {
      type: String,
      enum: ["SUBMITTED", "SHORTLISTED", "ACCEPTED", "REJECTED", "WITHDRAWN"],
      default: "SUBMITTED"
    },
    decisionReason: String
  },
  { timestamps: true }
);

jobApplicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

export const JobApplication = mongoose.model("JobApplication", jobApplicationSchema);
