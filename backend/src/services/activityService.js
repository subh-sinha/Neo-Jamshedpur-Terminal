import { ActivityLog } from "../models/ActivityLog.js";

export async function logActivity(payload) {
  return ActivityLog.create(payload);
}
