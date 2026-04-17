import { StatusCodes } from "http-status-codes";
import { JOB_CANCELLATION_TYPE, JOB_STATUS, NOTIFICATION_CATEGORY, PRIORITY, USER_ROLES, VERIFICATION_STATUS } from "../constants/enums.js";
import { Job } from "../models/Job.js";
import { JobApplication } from "../models/JobApplication.js";
import { JobStatusLog } from "../models/JobStatusLog.js";
import { Dispute } from "../models/Dispute.js";
import { AppError } from "../utils/appError.js";
import { REPUTATION_EVENTS } from "../utils/reputation.js";
import { logActivity } from "./activityService.js";
import { notifyUser } from "./notificationService.js";
import { applyReputationChange } from "./reputationService.js";

function normalizeLegacyJob(job) {
  const statusMap = {
    posted: JOB_STATUS.POSTED,
    applied: JOB_STATUS.APPLIED,
    assigned: JOB_STATUS.ASSIGNED,
    in_progress: JOB_STATUS.IN_PROGRESS,
    completed: JOB_STATUS.COMPLETED,
    verified: JOB_STATUS.VERIFIED,
    cancelled: JOB_STATUS.CANCELLED,
    disputed: JOB_STATUS.DISPUTED,
    expired: JOB_STATUS.EXPIRED
  };
  const allowedCategories = new Set(["service", "freelance", "local", "community", "urgent"]);

  if (typeof job.status === "string") {
    job.status = statusMap[job.status] || job.status;
  }
  if (!allowedCategories.has(job.category)) {
    job.category = "service";
  }
}

const JOB_TRANSITIONS = {
  [JOB_STATUS.POSTED]: [JOB_STATUS.APPLIED, JOB_STATUS.ASSIGNED, JOB_STATUS.CANCELLED, JOB_STATUS.EXPIRED],
  [JOB_STATUS.APPLIED]: [JOB_STATUS.ASSIGNED, JOB_STATUS.CANCELLED, JOB_STATUS.DISPUTED],
  [JOB_STATUS.ASSIGNED]: [JOB_STATUS.IN_PROGRESS, JOB_STATUS.CANCELLED, JOB_STATUS.DISPUTED],
  [JOB_STATUS.IN_PROGRESS]: [JOB_STATUS.COMPLETED, JOB_STATUS.DISPUTED],
  [JOB_STATUS.COMPLETED]: [JOB_STATUS.VERIFIED, JOB_STATUS.DISPUTED],
  [JOB_STATUS.VERIFIED]: [],
  [JOB_STATUS.CANCELLED]: [],
  [JOB_STATUS.DISPUTED]: [],
  [JOB_STATUS.EXPIRED]: []
};

export async function recordJobStatus({ job, fromStatus, toStatus, actor, note }) {
  await JobStatusLog.create({
    job: job._id,
    fromStatus,
    toStatus,
    actor,
    note
  });
}

export async function updateJobStatus({ jobId, user, nextStatus, note }) {
  const job = await Job.findById(jobId);
  if (!job) {
    throw new AppError("Job not found", StatusCodes.NOT_FOUND);
  }
  normalizeLegacyJob(job);

  const allowed = JOB_TRANSITIONS[job.status] || [];
  if (!allowed.includes(nextStatus)) {
    throw new AppError(`Cannot move job from ${job.status} to ${nextStatus}`);
  }

  const isOwner = String(job.postedBy) === String(user._id);
  const isAssignedWorker = String(job.selectedWorker) === String(user._id);
  const isAdmin = user.role === USER_ROLES.ADMIN;

  if ([JOB_STATUS.ASSIGNED, JOB_STATUS.CANCELLED, JOB_STATUS.VERIFIED].includes(nextStatus) && !isOwner && !isAdmin) {
    throw new AppError("Only the job owner or admin can do that", StatusCodes.FORBIDDEN);
  }

  if ([JOB_STATUS.IN_PROGRESS, JOB_STATUS.COMPLETED].includes(nextStatus) && !isAssignedWorker && !isAdmin) {
    throw new AppError("Only the assigned worker or admin can do that", StatusCodes.FORBIDDEN);
  }

  const previousStatus = job.status;
  job.status = nextStatus;
  if (nextStatus === JOB_STATUS.COMPLETED) {
    job.completedAt = new Date();
    await notifyUser({
      user: job.postedBy,
      title: "Job marked completed",
      message: `${job.title} is awaiting your verification`,
      category: NOTIFICATION_CATEGORY.JOB,
      priority: PRIORITY.HIGH,
      link: `/jobs/${job._id}`
    });
  }
  if (nextStatus === JOB_STATUS.VERIFIED) {
    job.verificationState = VERIFICATION_STATUS.VERIFIED;
    job.verifiedAt = new Date();
    if (job.selectedWorker) {
      await applyReputationChange({
        userId: job.selectedWorker,
        delta: REPUTATION_EVENTS.JOB_VERIFIED,
        reason: "Verified job completion",
        sourceType: "job",
        sourceId: job._id
      });
    }
  }

  await job.save();
  await recordJobStatus({ job, fromStatus: previousStatus, toStatus: nextStatus, actor: user._id, note });
  await logActivity({
    user: user._id,
    entityType: "job",
    entityId: job._id,
    action: `job:${nextStatus}`,
    summary: `${user.username} moved ${job.title} to ${nextStatus}`
  });

  if (job.selectedWorker && String(job.selectedWorker) !== String(user._id)) {
    await notifyUser({
      user: job.selectedWorker,
      title: "Job status updated",
      message: `${job.title} moved to ${nextStatus.replace("_", " ")}`,
      category: NOTIFICATION_CATEGORY.JOB,
      priority: nextStatus === JOB_STATUS.DISPUTED ? PRIORITY.HIGH : PRIORITY.NORMAL,
      link: `/jobs/${job._id}`
    });
  }

  return job;
}

export async function applyForJob({ jobId, user, pitch, proposedBudget, availability }) {
  const job = await Job.findById(jobId);
  if (!job) {
    throw new AppError("Job not found", StatusCodes.NOT_FOUND);
  }
  normalizeLegacyJob(job);
  if (String(job.postedBy) === String(user._id)) {
    throw new AppError("You cannot apply to your own job");
  }
  if ([JOB_STATUS.CANCELLED, JOB_STATUS.DISPUTED, JOB_STATUS.EXPIRED, JOB_STATUS.VERIFIED].includes(job.status)) {
    throw new AppError("This job is not accepting applications");
  }

  const application = await JobApplication.create({
    job: job._id,
    applicant: user._id,
    pitch,
    proposedBudget,
    expectedPrice: proposedBudget,
    availability
  });

  job.applicants.push(application._id);
  if (job.status === JOB_STATUS.POSTED) {
    job.status = JOB_STATUS.APPLIED;
    await recordJobStatus({ job, fromStatus: JOB_STATUS.POSTED, toStatus: JOB_STATUS.APPLIED, actor: user._id, note: "First application received" });
  }
  await job.save();

  await notifyUser({
    user: job.postedBy,
    title: "New application received",
    message: `${user.fullName} applied to ${job.title}`,
    category: NOTIFICATION_CATEGORY.JOB,
    link: `/jobs/${job._id}`
  });

  return application;
}

export async function decideJobApplication({ jobId, owner, applicationId, decision, reason }) {
  const job = await Job.findById(jobId);
  const application = await JobApplication.findById(applicationId).populate("applicant", "fullName");
  if (!job || !application || String(application.job) !== String(job._id)) {
    throw new AppError("Job or application not found", StatusCodes.NOT_FOUND);
  }
  normalizeLegacyJob(job);
  if (String(job.postedBy) !== String(owner._id) && owner.role !== USER_ROLES.ADMIN) {
    throw new AppError("Only the job owner can decide on applications", StatusCodes.FORBIDDEN);
  }

  if (decision === "ACCEPTED") {
    return assignJob({ jobId, owner, applicationId });
  }

  application.status = "REJECTED";
  application.decisionReason = reason;
  await application.save();
  await notifyUser({
    user: application.applicant._id,
    title: "Application update",
    message: `Your application for ${job.title} was declined`,
    category: NOTIFICATION_CATEGORY.JOB,
    link: `/jobs/${job._id}`
  });
  return application;
}

export async function assignJob({ jobId, owner, applicationId }) {
  const job = await Job.findById(jobId);
  const application = await JobApplication.findById(applicationId);
  if (!job || !application || String(application.job) !== String(job._id)) {
    throw new AppError("Job or application not found", StatusCodes.NOT_FOUND);
  }
  normalizeLegacyJob(job);
  if (String(job.postedBy) !== String(owner._id) && owner.role !== USER_ROLES.ADMIN) {
    throw new AppError("Only the job owner can assign workers", StatusCodes.FORBIDDEN);
  }

  job.selectedWorker = application.applicant;
  const previousStatus = job.status;
  job.status = JOB_STATUS.ASSIGNED;
  await job.save();

  application.status = "ACCEPTED";
  await application.save();
  await JobApplication.updateMany(
    { job: job._id, _id: { $ne: application._id }, status: { $in: ["SUBMITTED", "SHORTLISTED"] } },
    { $set: { status: "REJECTED", decisionReason: "Another applicant was selected" } }
  );
  await recordJobStatus({ job, fromStatus: previousStatus, toStatus: JOB_STATUS.ASSIGNED, actor: owner._id, note: "Worker assigned" });

  await notifyUser({
    user: application.applicant,
    title: "Application accepted",
    message: `You were assigned to ${job.title}`,
    category: NOTIFICATION_CATEGORY.JOB,
    priority: PRIORITY.HIGH,
    link: `/jobs/${job._id}`
  });

  return job;
}

export async function createJobDispute({ jobId, user, reason }) {
  const job = await Job.findById(jobId);
  if (!job) {
    throw new AppError("Job not found", StatusCodes.NOT_FOUND);
  }
  normalizeLegacyJob(job);
  const dispute = await Dispute.create({
    entityType: "job",
    entityId: job._id,
    openedBy: user._id,
    againstUser: job.selectedWorker || job.postedBy,
    reason
  });
  const previousStatus = job.status;
  job.status = JOB_STATUS.DISPUTED;
  job.dispute = dispute._id;
  await job.save();
  await recordJobStatus({ job, fromStatus: previousStatus, toStatus: JOB_STATUS.DISPUTED, actor: user._id, note: reason });
  if (dispute.againstUser) {
    await applyReputationChange({
      userId: dispute.againstUser,
      delta: REPUTATION_EVENTS.DISPUTE_LOSS,
      reason: "Job dispute raised against user",
      sourceType: "job",
      sourceId: job._id
    });
  }
  return dispute;
}

export async function cancelJobWithImpact({ jobId, user, reason }) {
  const job = await Job.findById(jobId).populate("postedBy", "fullName username").populate("selectedWorker", "fullName username");
  if (!job) {
    throw new AppError("Job not found", StatusCodes.NOT_FOUND);
  }
  normalizeLegacyJob(job);

  const isOwner = String(job.postedBy._id) === String(user._id);
  const isWorker = job.selectedWorker && String(job.selectedWorker._id) === String(user._id);
  const isAdmin = user.role === USER_ROLES.ADMIN;

  if (!isOwner && !isWorker && !isAdmin) {
    throw new AppError("You cannot cancel this job", StatusCodes.FORBIDDEN);
  }
  if (job.status === JOB_STATUS.VERIFIED || job.status === JOB_STATUS.COMPLETED) {
    throw new AppError("Completed or verified jobs cannot be cancelled", StatusCodes.BAD_REQUEST);
  }
  if (job.status === JOB_STATUS.CANCELLED) {
    throw new AppError("Job is already cancelled", StatusCodes.BAD_REQUEST);
  }
  if (isWorker && ![JOB_STATUS.ASSIGNED, JOB_STATUS.IN_PROGRESS].includes(job.status)) {
    throw new AppError("Worker can only cancel after assignment or during early progress", StatusCodes.FORBIDDEN);
  }
  if ((job.status === JOB_STATUS.ASSIGNED || job.status === JOB_STATUS.IN_PROGRESS) && !reason?.trim()) {
    throw new AppError("Cancellation reason is required after assignment", StatusCodes.BAD_REQUEST);
  }

  const previousStatus = job.status;
  const earlyCancellation = [JOB_STATUS.POSTED, JOB_STATUS.APPLIED, JOB_STATUS.ASSIGNED].includes(previousStatus);
  const duringProgress = previousStatus === JOB_STATUS.IN_PROGRESS;
  const cancellationType = isAdmin
    ? JOB_CANCELLATION_TYPE.AUTO
    : isWorker
      ? JOB_CANCELLATION_TYPE.WORKER
      : JOB_CANCELLATION_TYPE.OWNER;

  job.status = JOB_STATUS.CANCELLED;
  job.cancellationType = cancellationType;
  job.cancellationReason = reason || "No reason provided";
  job.cancelledAt = new Date();
  job.cancelledBy = user._id;
  job.cancellationStage = previousStatus;
  await job.save();

  await recordJobStatus({
    job,
    fromStatus: previousStatus,
    toStatus: JOB_STATUS.CANCELLED,
    actor: user._id,
    note: `${cancellationType}: ${job.cancellationReason}`
  });

  await logActivity({
    user: user._id,
    entityType: "job",
    entityId: job._id,
    action: "job:cancelled",
    summary: `${job.title} cancelled at ${previousStatus}`
  });

  const notifications = [];
  if (job.selectedWorker) {
    notifications.push(
      notifyUser({
        user: job.selectedWorker._id,
        title: "Job cancelled",
        message: `${job.title} was cancelled. Reason: ${job.cancellationReason}`,
        category: NOTIFICATION_CATEGORY.JOB,
        priority: duringProgress ? PRIORITY.HIGH : PRIORITY.NORMAL,
        link: `/jobs/${job._id}`
      })
    );
  }
  notifications.push(
    notifyUser({
      user: job.postedBy._id,
      title: "Job cancellation recorded",
      message: `${job.title} was cancelled at ${previousStatus}`,
      category: NOTIFICATION_CATEGORY.JOB,
      priority: duringProgress ? PRIORITY.HIGH : PRIORITY.NORMAL,
      link: `/jobs/${job._id}`
    })
  );

  const applicants = await JobApplication.find({ job: job._id }).select("applicant");
  for (const application of applicants) {
    if (String(application.applicant) !== String(job.selectedWorker?._id) && String(application.applicant) !== String(job.postedBy._id)) {
      notifications.push(
        notifyUser({
          user: application.applicant,
          title: "Job closed",
          message: `${job.title} was cancelled before further progress`,
          category: NOTIFICATION_CATEGORY.JOB,
          link: `/jobs/${job._id}`
        })
      );
    }
  }
  const admins = await Job.db.model("User").find({ role: USER_ROLES.ADMIN }).select("_id");
  for (const admin of admins) {
    if (String(admin._id) !== String(user._id)) {
      notifications.push(
        notifyUser({
          user: admin._id,
          title: "Job cancellation alert",
          message: `${job.title} was cancelled by ${user.username}`,
          category: NOTIFICATION_CATEGORY.ADMIN,
          priority: duringProgress ? PRIORITY.HIGH : PRIORITY.NORMAL,
          link: `/jobs/${job._id}`
        })
      );
    }
  }
  await Promise.all(notifications);

  if (!isAdmin) {
    const delta = duringProgress ? REPUTATION_EVENTS.LATE_CANCELLATION : earlyCancellation ? 0 : REPUTATION_EVENTS.CANCELLATION;
    if (delta !== 0) {
      await applyReputationChange({
        userId: user._id,
        delta,
        reason: duringProgress ? "Late job cancellation" : "Job cancelled after assignment",
        sourceType: "job",
        sourceId: job._id
      });
    }
  }

  return job;
}
