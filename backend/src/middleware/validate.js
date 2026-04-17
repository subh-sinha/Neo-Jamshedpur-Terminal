import { validationResult } from "express-validator";
import { AppError } from "../utils/appError.js";

export function validate(req, res, next) {
  const result = validationResult(req);
  if (result.isEmpty()) {
    return next();
  }
  next(new AppError("Validation failed", 422, result.array()));
}
