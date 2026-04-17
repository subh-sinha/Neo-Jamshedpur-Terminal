import { body } from "express-validator";
import { PRIORITY, PULSE_CATEGORY } from "../constants/enums.js";

export const createPulseValidator = [
  body("title").trim().notEmpty(),
  body("summary").trim().notEmpty(),
  body("content").trim().notEmpty(),
  body("category").isIn(Object.values(PULSE_CATEGORY)),
  body("priority").optional().isIn(Object.values(PRIORITY)),
  body("media").optional().isArray()
];
