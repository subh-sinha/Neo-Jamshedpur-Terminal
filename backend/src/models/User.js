import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { USER_ROLES, VERIFICATION_STATUS } from "../constants/enums.js";
import { getTrustRank } from "../utils/reputation.js";

const notificationPreferencesSchema = new mongoose.Schema(
  {
    criticalAlerts: { type: Boolean, default: true },
    jobUpdates: { type: Boolean, default: true },
    tradeUpdates: { type: Boolean, default: true },
    community: { type: Boolean, default: false }
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    username: { type: String, required: true, unique: true, trim: true, lowercase: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true, minlength: 6, select: false },
    role: {
      type: String,
      enum: Object.values(USER_ROLES),
      default: USER_ROLES.CITIZEN
    },
    avatar: String,
    bio: String,
    sector: String,
    phone: String,
    reputationScore: { type: Number, default: 40 },
    completedJobsCount: { type: Number, default: 0 },
    successfulTradesCount: { type: Number, default: 0 },
    disputesCount: { type: Number, default: 0 },
    verificationStatus: {
      type: String,
      enum: Object.values(VERIFICATION_STATUS),
      default: VERIFICATION_STATUS.NONE
    },
    notificationPreferences: { type: notificationPreferencesSchema, default: () => ({}) },
    recentActivity: [{ type: mongoose.Schema.Types.ObjectId, ref: "ActivityLog" }]
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

userSchema.virtual("trustRank").get(function trustRank() {
  return getTrustRank(this.reputationScore || 0);
});

userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) {
    next();
    return;
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = function comparePassword(password) {
  return bcrypt.compare(password, this.password);
};

export const User = mongoose.model("User", userSchema);
