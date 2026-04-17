import { StatusCodes } from "http-status-codes";
import { User } from "../models/User.js";
import { ActivityLog } from "../models/ActivityLog.js";
import { ReputationRecord } from "../models/ReputationRecord.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/appError.js";

export const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    throw new AppError("User not found", StatusCodes.NOT_FOUND);
  }
  res.json(user);
});

export const getUserActivity = asyncHandler(async (req, res) => {
  const activity = await ActivityLog.find({ user: req.params.id }).sort({ createdAt: -1 }).limit(20);
  res.json(activity);
});

export const getUserReputation = asyncHandler(async (req, res) => {
  const records = await ReputationRecord.find({ user: req.params.id }).sort({ createdAt: -1 }).limit(20);
  res.json(records);
});
