import { StatusCodes } from "http-status-codes";
import { OAuth2Client } from "google-auth-library";
import { NOTIFICATION_CATEGORY, PRIORITY, USER_ROLES, VERIFICATION_STATUS } from "../constants/enums.js";
import { User } from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/appError.js";
import { signToken } from "../utils/jwt.js";
import { pick } from "../utils/pick.js";
import { notifyMany } from "../services/notificationService.js";

function authPayload(user) {
  return {
    token: signToken({ id: user._id, role: user.role }),
    user
  };
}

export const register = asyncHandler(async (req, res) => {
  const exists = await User.findOne({ $or: [{ email: req.body.email }, { username: req.body.username }] });
  if (exists) {
    throw new AppError("User already exists", StatusCodes.CONFLICT);
  }

  const user = await User.create({
    ...pick(req.body, ["fullName", "username", "email", "password", "sector", "bio", "phone"]),
    avatar: req.body.avatar || `https://api.dicebear.com/8.x/shapes/svg?seed=${req.body.username}`
  });

  res.status(StatusCodes.CREATED).json(authPayload(user));
});

export const login = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email }).select("+password");
  if (!user || !(await user.comparePassword(req.body.password))) {
    throw new AppError("Invalid credentials", StatusCodes.UNAUTHORIZED);
  }

  user.password = undefined;
  res.json(authPayload(user));
});

export const me = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate("recentActivity");
  res.json(user);
});

export const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: pick(req.body, [
        "fullName",
        "avatar",
        "bio",
        "sector",
        "phone",
        "notificationPreferences"
      ])
    },
    { new: true }
  );
  res.json(user);
});

export const requestProviderVerification = asyncHandler(async (req, res) => {
  if (req.user.role === USER_ROLES.PROVIDER || req.user.verificationStatus === VERIFICATION_STATUS.VERIFIED) {
    throw new AppError("You are already a verified provider", StatusCodes.BAD_REQUEST);
  }

  if (req.user.verificationStatus === VERIFICATION_STATUS.PENDING) {
    throw new AppError("Your provider verification request is already pending", StatusCodes.BAD_REQUEST);
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        verificationStatus: VERIFICATION_STATUS.PENDING
      }
    },
    { new: true }
  );

  const admins = await User.find({ role: USER_ROLES.ADMIN }, "_id");
  if (admins.length) {
    await notifyMany(
      admins.map((admin) => admin._id),
      {
        title: "Provider verification request",
        message: `${user.fullName} requested provider verification.`,
        category: NOTIFICATION_CATEGORY.VERIFICATION,
        priority: PRIORITY.HIGH,
        link: "/admin/users"
      }
    );
  }

  res.json(user);
});

export const logout = asyncHandler(async (req, res) => {
  res.json({ message: "Logout handled client-side by dropping the token." });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;
  if (!email || !oldPassword || !newPassword) {
    throw new AppError("Email, old password, and new password are required", StatusCodes.BAD_REQUEST);
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new AppError("User not found", StatusCodes.NOT_FOUND);
  }
  if (!(await user.comparePassword(oldPassword))) {
    throw new AppError("Invalid old password", StatusCodes.UNAUTHORIZED);
  }
  user.password = newPassword;
  await user.save();
  res.json({ message: "Password reset successful" });
});

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleAuth = asyncHandler(async (req, res) => {
  const { token } = req.body;
  if (!token) throw new AppError("Google token is required", StatusCodes.BAD_REQUEST);

  const ticket = await googleClient.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID
  });
  const payload = ticket.getPayload();
  const { email, name, picture } = payload;

  let user = await User.findOne({ email });
  if (!user) {
    const baseUsername = email.split("@")[0].replace(/[^a-zA-Z0-9]/g, "");
    const randomSuffix = Math.random().toString(36).substring(2, 6);
    const generatedUsername = baseUsername + randomSuffix;
    const generatedPassword = Math.random().toString(36).slice(-10) + "A1!";

    user = await User.create({
      fullName: name,
      username: generatedUsername,
      email: email,
      password: generatedPassword,
      avatar: picture || "https://api.dicebear.com/8.x/shapes/svg?seed=" + generatedUsername,
      role: USER_ROLES.CITIZEN
    });
  }

  res.json(authPayload(user));
});

