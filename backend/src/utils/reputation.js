import { TRUST_RANKS } from "../constants/enums.js";

export function getTrustRank(score) {
  return [...TRUST_RANKS].reverse().find((rank) => score >= rank.min)?.label || "New";
}

export const REPUTATION_EVENTS = {
  JOB_VERIFIED: 25,
  TRADE_COMPLETED: 18,
  DISPUTE_LOSS: -20,
  CANCELLATION: -8,
  LATE_CANCELLATION: -14,
  COMMUNITY_ENGAGEMENT: 4,
  PROVIDER_VERIFIED: 40
};
