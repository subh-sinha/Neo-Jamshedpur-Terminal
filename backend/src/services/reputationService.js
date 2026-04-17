import { User } from "../models/User.js";
import { ReputationRecord } from "../models/ReputationRecord.js";

export async function applyReputationChange({ userId, delta, reason, sourceType, sourceId }) {
  await ReputationRecord.create({ user: userId, delta, reason, sourceType, sourceId });
  await User.findByIdAndUpdate(userId, { $inc: { reputationScore: delta } });
}
