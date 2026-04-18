import { StatusCodes } from "http-status-codes";
import { PRIORITY, USER_ROLES, VERIFICATION_STATUS } from "../constants/enums.js";
import { User } from "../models/User.js";
import { Dispute } from "../models/Dispute.js";
import { Job } from "../models/Job.js";
import { TradeListing } from "../models/TradeListing.js";
import { PulsePost } from "../models/PulsePost.js";
import { Notification } from "../models/Notification.js";
import { AppError } from "../utils/appError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { REPUTATION_EVENTS } from "../utils/reputation.js";
import { applyReputationChange } from "../services/reputationService.js";
import { notifyMany, notifyUser } from "../services/notificationService.js";

export const analytics = asyncHandler(async (req, res) => {
  const [users, jobs, trades, pulse, disputes, notifications] = await Promise.all([
    User.countDocuments(),
    Job.countDocuments(),
    TradeListing.countDocuments(),
    PulsePost.countDocuments(),
    Dispute.countDocuments(),
    Notification.countDocuments()
  ]);
  res.json({ users, jobs, trades, pulse, disputes, notifications });
});

export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.json(users);
});

export const verifyUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      $set: { verificationStatus: VERIFICATION_STATUS.VERIFIED, role: USER_ROLES.PROVIDER }
    },
    { new: true }
  );
  if (!user) {
    throw new AppError("User not found", StatusCodes.NOT_FOUND);
  }
  await applyReputationChange({
    userId: user._id,
    delta: REPUTATION_EVENTS.PROVIDER_VERIFIED,
    reason: "Provider verification granted",
    sourceType: "user",
    sourceId: user._id
  });
  await notifyUser({
    user: user._id,
    title: "Provider verification approved",
    message: "Your account is now verified as a provider.",
    category: "verification",
    priority: PRIORITY.HIGH,
    link: "/profile"
  });
  res.json(user);
});

export const sendAlert = asyncHandler(async (req, res) => {
  const users = await User.find({}, "_id");
  await notifyMany(
    users.map((user) => user._id),
    {
      title: req.body.title,
      message: req.body.message,
      category: "admin",
      priority: req.body.priority || PRIORITY.HIGH,
      link: req.body.link || "/dashboard"
    }
  );
  res.status(StatusCodes.CREATED).json({ message: "Alert broadcast sent" });
});

export const resolveDispute = asyncHandler(async (req, res) => {
  const dispute = await Dispute.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        status: "resolved",
        resolution: req.body.resolution,
        resolvedBy: req.user._id
      }
    },
    { new: true }
  );
  if (!dispute) {
    throw new AppError("Dispute not found", StatusCodes.NOT_FOUND);
  }
  if (req.body.penalizeUserId) {
    await applyReputationChange({
      userId: req.body.penalizeUserId,
      delta: REPUTATION_EVENTS.DISPUTE_LOSS,
      reason: "Dispute resolved against user",
      sourceType: "dispute",
      sourceId: dispute._id
    });
  }
  res.json(dispute);
});
