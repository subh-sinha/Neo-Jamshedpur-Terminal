export const USER_ROLES = {
  CITIZEN: "citizen",
  PROVIDER: "provider",
  ADMIN: "admin"
};

export const VERIFICATION_STATUS = {
  NONE: "none",
  PENDING: "pending",
  VERIFIED: "verified"
};

export const JOB_STATUS = {
  POSTED: "POSTED",
  APPLIED: "APPLIED",
  ASSIGNED: "ASSIGNED",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  VERIFIED: "VERIFIED",
  CANCELLED: "CANCELLED",
  DISPUTED: "DISPUTED",
  EXPIRED: "EXPIRED"
};

export const JOB_CATEGORIES = {
  SERVICE: "service",
  FREELANCE: "freelance",
  LOCAL: "local",
  COMMUNITY: "community",
  URGENT: "urgent"
};

export const JOB_URGENCY = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  CRITICAL: "critical"
};

export const JOB_CANCELLATION_TYPE = {
  OWNER: "CANCELLED_BY_OWNER",
  WORKER: "CANCELLED_BY_WORKER",
  AUTO: "AUTO_CANCELLED"
};

export const TRADE_STATUS = {
  LISTED: "listed",
  OFFER_MADE: "offer_made",
  NEGOTIATION: "negotiation",
  ACCEPTED: "accepted",
  COMPLETED: "completed",
  DECLINED: "declined",
  CANCELLED: "cancelled",
  DISPUTED: "disputed",
  ARCHIVED: "archived"
};

export const OFFER_STATUS = {
  OPEN: "open",
  COUNTERED: "countered",
  ACCEPTED: "accepted",
  REJECTED: "rejected",
  WITHDRAWN: "withdrawn",
  COMPLETED: "completed"
};

export const DISPUTE_STATUS = {
  OPEN: "open",
  REVIEWING: "reviewing",
  RESOLVED: "resolved",
  REJECTED: "rejected"
};

export const PULSE_CATEGORY = {
  ALERT: "ALERT",
  INFRASTRUCTURE: "INFRASTRUCTURE",
  EVENT: "EVENT",
  COMMUNITY: "COMMUNITY",
  TREND: "TREND",
  SAFETY: "SAFETY"
};

export const PRIORITY = {
  CRITICAL: "CRITICAL",
  HIGH: "HIGH",
  NORMAL: "NORMAL"
};

export const NOTIFICATION_CATEGORY = {
  JOB: "job",
  TRADE: "trade",
  PULSE: "pulse",
  ADMIN: "admin",
  SYSTEM: "system",
  VERIFICATION: "verification"
};

export const TRUST_RANKS = [
  { min: 0, label: "New" },
  { min: 120, label: "Reliable" },
  { min: 260, label: "Trusted" },
  { min: 420, label: "Elite" }
];
