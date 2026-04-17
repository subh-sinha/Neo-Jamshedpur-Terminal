import { asyncHandler } from "../utils/asyncHandler.js";
import { Job } from "../models/Job.js";
import { TradeListing } from "../models/TradeListing.js";
import { PulsePost } from "../models/PulsePost.js";
import { User } from "../models/User.js";

export const globalSearch = asyncHandler(async (req, res) => {
  const q = req.query.q || "";
  const regex = { $regex: q, $options: "i" };
  const [jobs, trades, pulse, users] = await Promise.all([
    Job.find({ $or: [{ title: regex }, { description: regex }] }).limit(8),
    TradeListing.find({ $or: [{ title: regex }, { description: regex }] }).limit(8),
    PulsePost.find({ $or: [{ title: regex }, { summary: regex }] }).limit(8),
    User.find({ $or: [{ fullName: regex }, { username: regex }, { sector: regex }] }).select("fullName username role sector reputationScore").limit(8)
  ]);

  res.json({
    query: q,
    jobs,
    trades,
    pulse,
    users,
    trendingCategories: ["logistics", "microgrid", "district maintenance", "biofabrication"]
  });
});
