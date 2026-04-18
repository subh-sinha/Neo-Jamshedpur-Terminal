import { StatusCodes } from "http-status-codes";
import { User } from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/appError.js";
import { signToken } from "../utils/jwt.js";
import { pick } from "../utils/pick.js";

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
