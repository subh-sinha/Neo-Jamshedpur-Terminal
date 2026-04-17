import { StatusCodes } from "http-status-codes";
import { PRIORITY, PULSE_CATEGORY, USER_ROLES, VERIFICATION_STATUS } from "../constants/enums.js";
import { PulsePost } from "../models/PulsePost.js";
import { Reaction } from "../models/Reaction.js";
import { User } from "../models/User.js";
import { PulseBookmark } from "../models/PulseBookmark.js";
import { PulseView } from "../models/PulseView.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/appError.js";
import { pick } from "../utils/pick.js";
import { emitRealtime, notifyMany, notifyUser } from "../services/notificationService.js";

const priorityRank = {
  [PRIORITY.CRITICAL]: 3,
  [PRIORITY.HIGH]: 2,
  [PRIORITY.NORMAL]: 1
};

function sortPosts(posts, sort = "priority") {
  return [...posts].sort((a, b) => {
    const priorityDiff = (priorityRank[b.priority] || 0) - (priorityRank[a.priority] || 0);
    if (sort !== "latest" && priorityDiff !== 0) return priorityDiff;
    if (sort === "trending") {
      const trendDiff = (b.trendingScore || 0) - (a.trendingScore || 0);
      if (trendDiff !== 0) return trendDiff;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

function canPublishPulse(user, body) {
  const isAdmin = user.role === USER_ROLES.ADMIN;
  const isVerified = user.role === USER_ROLES.PROVIDER || user.verificationStatus === VERIFICATION_STATUS.VERIFIED;

  if (isAdmin) return true;
  if (body.priority === PRIORITY.CRITICAL) return false;
  if (isVerified) return true;
  return body.priority === PRIORITY.NORMAL;
}

export const getPulsePosts = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.category) filter.category = req.query.category;
  if (req.query.priority) filter.priority = req.query.priority;
  if (req.query.q) {
    filter.$or = [
      { title: { $regex: req.query.q, $options: "i" } },
      { summary: { $regex: req.query.q, $options: "i" } },
      { content: { $regex: req.query.q, $options: "i" } }
    ];
  }

  const posts = await PulsePost.find(filter)
    .populate("author", "fullName username role avatar verificationStatus")
    .sort({ createdAt: -1 });

  const enriched = posts.map((post) => {
    const ageHours = Math.max(1, (Date.now() - new Date(post.createdAt).getTime()) / (1000 * 60 * 60));
    const stalePenalty = ageHours > 72 ? 8 : ageHours > 24 ? 3 : 0;
    return {
      ...post.toObject(),
      visibilityScore: (priorityRank[post.priority] || 0) * 100 + (post.trendingScore || 0) + (post.reactionsCount || 0) - stalePenalty
    };
  });

  const sorted = sortPosts(enriched, req.query.sort || "priority");
  res.json(sorted);
});

export const createPulsePost = asyncHandler(async (req, res) => {
  if (!canPublishPulse(req.user, req.body)) {
    throw new AppError("You are not allowed to publish this type of Pulse update", StatusCodes.FORBIDDEN);
  }

  const duplicate = await PulsePost.findOne({
    author: req.user._id,
    title: req.body.title,
    createdAt: { $gte: new Date(Date.now() - 1000 * 60 * 30) }
  });
  if (duplicate) {
    throw new AppError("A similar post was already published recently");
  }

  const payload = pick(req.body, ["title", "summary", "content", "category", "priority", "pinned", "sector", "location", "media"]);
  payload.author = req.user._id;
  payload.isOfficial = req.user.role === USER_ROLES.ADMIN || req.user.role === USER_ROLES.PROVIDER;
  if (req.user.role === USER_ROLES.ADMIN || req.user.verificationStatus === VERIFICATION_STATUS.VERIFIED) {
    payload.verificationStatus = "VERIFIED";
  }

  const post = await PulsePost.create(payload);
  const populated = await PulsePost.findById(post._id).populate("author", "fullName username role avatar verificationStatus");

  const interestedUsers = await User.find({
    $or: [
      { "notificationPreferences.criticalAlerts": true, ...(post.priority === PRIORITY.CRITICAL ? {} : { _id: null }) },
      { "notificationPreferences.community": true, ...(post.category === PULSE_CATEGORY.COMMUNITY ? {} : { _id: null }) }
    ]
  }).select("_id");

  if (post.priority === PRIORITY.CRITICAL || post.priority === PRIORITY.HIGH) {
    const users = post.priority === PRIORITY.CRITICAL ? await User.find({}, "_id") : interestedUsers;
    await notifyMany(
      users.map((user) => user._id),
      {
        title: post.priority === PRIORITY.CRITICAL ? "Critical city alert" : "High-priority Pulse update",
        message: post.title,
        category: "pulse",
        priority: post.priority,
        link: `/pulse/${post._id}`
      }
    );
  }

  emitRealtime("pulse:new", populated);
  if (post.priority === PRIORITY.CRITICAL) {
    emitRealtime("pulse:critical", populated);
  }

  res.status(201).json(populated);
});

export const getPulsePost = asyncHandler(async (req, res) => {
  const post = await PulsePost.findByIdAndUpdate(
    req.params.id,
    { $inc: { views: 1 }, $set: { lastEngagedAt: new Date() } },
    { new: true }
  ).populate("author", "fullName username role avatar verificationStatus");

  if (!post) {
    throw new AppError("Post not found", StatusCodes.NOT_FOUND);
  }

  if (req.user?._id) {
    await PulseView.findOneAndUpdate(
      { user: req.user._id, post: post._id },
      { $set: { viewedAt: new Date() } },
      { upsert: true, new: true }
    );
  }

  const bookmarked = req.user?._id ? Boolean(await PulseBookmark.findOne({ user: req.user._id, post: post._id })) : false;
  res.json({ ...post.toObject(), bookmarked });
});

export const updatePulsePost = asyncHandler(async (req, res) => {
  const post = await PulsePost.findById(req.params.id);
  if (!post) {
    throw new AppError("Post not found", StatusCodes.NOT_FOUND);
  }
  if (String(post.author) !== String(req.user._id) && req.user.role !== USER_ROLES.ADMIN) {
    throw new AppError("You cannot edit this post", StatusCodes.FORBIDDEN);
  }
  Object.assign(post, pick(req.body, ["title", "summary", "content", "category", "priority", "pinned", "sector", "location", "media"]));
  await post.save();
  emitRealtime("pulse:update", post);
  res.json(post);
});

export const deletePulsePost = asyncHandler(async (req, res) => {
  const post = await PulsePost.findById(req.params.id);
  if (!post) {
    throw new AppError("Post not found", StatusCodes.NOT_FOUND);
  }
  if (String(post.author) !== String(req.user._id) && req.user.role !== USER_ROLES.ADMIN) {
    throw new AppError("You cannot delete this post", StatusCodes.FORBIDDEN);
  }
  await post.deleteOne();
  emitRealtime("pulse:delete", { id: req.params.id });
  res.json({ message: "Pulse post deleted" });
});

export const reactPulsePost = asyncHandler(async (req, res) => {
  const existing = await Reaction.findOne({ user: req.user._id, post: req.params.id });
  const previousType = existing?.type;
  const reaction = await Reaction.findOneAndUpdate(
    { user: req.user._id, post: req.params.id },
    { $set: { type: req.body.type || "signal" } },
    { upsert: true, new: true }
  );
  const increment = previousType ? 0 : 1;
  const post = await PulsePost.findByIdAndUpdate(
    req.params.id,
    { $inc: { reactionsCount: increment, trendingScore: 2 }, $set: { lastEngagedAt: new Date() } },
    { new: true }
  );
  emitRealtime("pulse:engagement", { postId: req.params.id, reactionsCount: post.reactionsCount, trendingScore: post.trendingScore });
  res.json(reaction);
});

export const bookmarkPulsePost = asyncHandler(async (req, res) => {
  const existing = await PulseBookmark.findOne({ user: req.user._id, post: req.params.id });
  if (existing) {
    await existing.deleteOne();
    const post = await PulsePost.findByIdAndUpdate(req.params.id, { $inc: { bookmarksCount: -1 } }, { new: true });
    res.json({ saved: false, bookmarksCount: post?.bookmarksCount || 0 });
    return;
  }

  await PulseBookmark.create({ user: req.user._id, post: req.params.id });
  const post = await PulsePost.findByIdAndUpdate(
    req.params.id,
    { $inc: { bookmarksCount: 1, trendingScore: 1 }, $set: { lastEngagedAt: new Date() } },
    { new: true }
  );
  await notifyUser({
    user: req.user._id,
    title: "Pulse post saved",
    message: "Update added to your saved Pulse feed",
    category: "pulse",
    link: `/pulse/${req.params.id}`
  });
  res.json({ saved: true, bookmarksCount: post?.bookmarksCount || 0 });
});

export const getSavedPulsePosts = asyncHandler(async (req, res) => {
  const bookmarks = await PulseBookmark.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .populate({ path: "post", populate: { path: "author", select: "fullName username role avatar verificationStatus" } });
  res.json(bookmarks.map((bookmark) => bookmark.post).filter(Boolean));
});

export const getPulseHistory = asyncHandler(async (req, res) => {
  const views = await PulseView.find({ user: req.user._id })
    .sort({ viewedAt: -1 })
    .limit(20)
    .populate({ path: "post", populate: { path: "author", select: "fullName username role avatar verificationStatus" } });
  res.json(views.map((view) => ({ ...view.post?.toObject(), viewedAt: view.viewedAt })).filter((item) => item._id));
});

export const moderatePulsePost = asyncHandler(async (req, res) => {
  if (req.user.role !== USER_ROLES.ADMIN) {
    throw new AppError("Admin access required", StatusCodes.FORBIDDEN);
  }
  const post = await PulsePost.findById(req.params.id);
  if (!post) {
    throw new AppError("Post not found", StatusCodes.NOT_FOUND);
  }
  if (req.body.flaggedReason) {
    post.verificationStatus = "FLAGGED";
    post.flaggedReason = req.body.flaggedReason;
  }
  if (req.body.verificationStatus) {
    post.verificationStatus = req.body.verificationStatus;
  }
  if (req.body.priority && Object.values(PRIORITY).includes(req.body.priority)) {
    post.priority = req.body.priority;
    post.escalatedBy = req.user._id;
  }
  if (req.body.pinned !== undefined) {
    post.pinned = Boolean(req.body.pinned);
  }
  await post.save();
  emitRealtime("pulse:update", post);
  res.json(post);
});
