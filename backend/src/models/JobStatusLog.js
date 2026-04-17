import mongoose from "mongoose";

const jobStatusLogSchema = new mongoose.Schema(
  {
    job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    fromStatus: String,
    toStatus: String,
    note: String,
    actor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

export const JobStatusLog = mongoose.model("JobStatusLog", jobStatusLogSchema);
