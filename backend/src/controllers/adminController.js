import { StatusCodes } from "http-status-codes";
import { PRIORITY, USER_ROLES, VERIFICATION_STATUS } from "../constants/enums.js";
import { User } from "../models/User.js";
import { Dispute } from "../models/Dispute.js";
import { Job } from "../models/Job.js";
import { TradeListing } from "../models/TradeListing.js";
import { PulsePost } from "../models/PulsePost.js";
import { Notification } from "../models/Notification.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { REPUTATION_EVENTS } from "../utils/reputation.js";
import { applyReputationChange } from "../services/reputationService.js";
import { notifyMany } from "../services/notificationService.js";

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
  await applyReputationChange({
    userId: user._id,
    delta: REPUTATION_EVENTS.PROVIDER_VERIFIED,
    reason: "Provider verification granted",
    sourceType: "user",
    sourceId: user._id
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
