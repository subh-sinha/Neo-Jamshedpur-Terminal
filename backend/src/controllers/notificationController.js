import { Notification } from "../models/Notification.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(50);
  res.json(notifications);
});

export const markNotificationRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { $set: { readAt: new Date() } },
    { new: true }
  );
  res.json(notification);
});

export const markAllNotificationsRead = asyncHandler(async (req, res) => {
  const deleted = await Notification.deleteMany({ user: req.user._id });
  res.json({ message: "All notifications cleared", deletedCount: deleted.deletedCount });
});
