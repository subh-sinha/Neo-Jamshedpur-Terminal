import { Job } from "../models/Job.js";
import { JobApplication } from "../models/JobApplication.js";
import { JobStatusLog } from "../models/JobStatusLog.js";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../utils/appError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { pick } from "../utils/pick.js";
import { applyForJob, cancelJobWithImpact, createJobDispute, decideJobApplication, updateJobStatus } from "../services/jobService.js";

export const getJobs = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.category) filter.category = req.query.category;
  if (req.query.sector) filter.sector = req.query.sector;
  if (req.query.locationMode) filter.locationMode = req.query.locationMode;
  if (req.query.urgency) filter.urgency = req.query.urgency;
  if (req.query.minBudget || req.query.maxBudget) {
    filter.budget = {};
    if (req.query.minBudget) filter.budget.$gte = Number(req.query.minBudget);
    if (req.query.maxBudget) filter.budget.$lte = Number(req.query.maxBudget);
  }
  if (req.query.q) {
    filter.$or = [
      { title: { $regex: req.query.q, $options: "i" } },
      { description: { $regex: req.query.q, $options: "i" } },
      { requiredSkills: { $elemMatch: { $regex: req.query.q, $options: "i" } } },
      { locationText: { $regex: req.query.q, $options: "i" } }
    ];
  }

  const jobs = await Job.find(filter)
    .populate("postedBy", "fullName username role reputationScore")
    .populate("selectedWorker", "fullName username")
    .sort({ createdAt: -1 });

  res.json(jobs);
});

export const createJob = asyncHandler(async (req, res) => {
  const payload = pick(req.body, [
    "title",
    "description",
    "category",
    "requiredSkills",
    "constraints",
    "budget",
    "budgetType",
    "paymentType",
    "locationMode",
    "locationText",
    "sector",
    "urgency",
    "deadline",
    "visibilityTier"
  ]);

  if (typeof payload.category === "string") payload.category = payload.category.toLowerCase();
  if (typeof payload.urgency === "string") payload.urgency = payload.urgency.toLowerCase();
  if (!payload.deadline) delete payload.deadline;
  if (!payload.locationText) delete payload.locationText;
  if (!payload.sector) delete payload.sector;

  const job = await Job.create({
    ...payload,
    postedBy: req.user._id
  });
  res.status(201).json(job);
});

export const getJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id)
    .populate("postedBy", "fullName username role avatar reputationScore trustRank")
    .populate("selectedWorker", "fullName username avatar reputationScore trustRank")
    .populate("cancelledBy", "fullName username role")
    .populate({
      path: "applicants",
      populate: { path: "applicant", select: "fullName username reputationScore trustRank avatar" }
    });
  if (!job) {
    throw new AppError("Job not found", StatusCodes.NOT_FOUND);
  }
  const logs = await JobStatusLog.find({ job: req.params.id }).populate("actor", "fullName username");
  res.json({ ...job.toObject(), logs });
});

export const updateJob = asyncHandler(async (req, res) => {
  const query = req.user.role === "admin" ? { _id: req.params.id } : { _id: req.params.id, postedBy: req.user._id };
  const job = await Job.findOneAndUpdate(query, { $set: req.body }, { new: true });
  if (!job) {
    throw new AppError("Job not found", StatusCodes.NOT_FOUND);
  }
  res.json(job);
});

export const deleteJob = asyncHandler(async (req, res) => {
  const query = req.user.role === "admin" ? { _id: req.params.id } : { _id: req.params.id, postedBy: req.user._id };
  const job = await Job.findOneAndDelete(query);
  if (!job) {
    throw new AppError("Job not found", StatusCodes.NOT_FOUND);
  }
  res.json({ message: "Job deleted" });
});

export const applyJob = asyncHandler(async (req, res) => {
  const application = await applyForJob({
    jobId: req.params.id,
    user: req.user,
    pitch: req.body.message,
    proposedBudget: req.body.expectedPrice,
    availability: req.body.availability
  });
  res.status(201).json(application);
});

export const decideJobApplicationController = asyncHandler(async (req, res) => {
  const result = await decideJobApplication({
    jobId: req.params.id,
    owner: req.user,
    applicationId: req.params.applicationId,
    decision: req.body.decision,
    reason: req.body.reason
  });
  res.json(result);
});

export const updateJobStatusController = asyncHandler(async (req, res) => {
  const job = await updateJobStatus({
    jobId: req.params.id,
    user: req.user,
    nextStatus: req.body.status,
    note: req.body.note
  });
  res.json(job);
});

export const cancelJob = asyncHandler(async (req, res) => {
  const job = await cancelJobWithImpact({ jobId: req.params.id, user: req.user, reason: req.body.reason });
  res.json(job);
});

export const disputeJob = asyncHandler(async (req, res) => {
  const dispute = await createJobDispute({ jobId: req.params.id, user: req.user, reason: req.body.reason });
  res.status(201).json(dispute);
});

export const myApplications = asyncHandler(async (req, res) => {
  const applications = await JobApplication.find({ applicant: req.user._id }).populate("job").sort({ createdAt: -1 });
  res.json(applications);
});

export const myJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find({ postedBy: req.user._id }).sort({ createdAt: -1 }).populate("selectedWorker", "fullName username");
  const applications = await JobApplication.find({ job: { $in: jobs.map((job) => job._id) } })
    .populate("applicant", "fullName username reputationScore")
    .sort({ createdAt: -1 });
  const stats = {
    total: jobs.length,
    active: jobs.filter((job) => [ "POSTED", "APPLIED", "ASSIGNED", "IN_PROGRESS" ].includes(job.status)).length,
    completed: jobs.filter((job) => job.status === "COMPLETED" || job.status === "VERIFIED").length,
    disputed: jobs.filter((job) => job.status === "DISPUTED").length
  };
  res.json({ jobs, applications, stats });
});
