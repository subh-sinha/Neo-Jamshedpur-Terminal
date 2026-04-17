import { body } from "express-validator";
import { JOB_CATEGORIES, JOB_STATUS, JOB_URGENCY } from "../constants/enums.js";

export const createJobValidator = [
  body("title").trim().notEmpty(),
  body("description").trim().isLength({ min: 5 }),
  body("category").trim().toLowerCase().isIn(Object.values(JOB_CATEGORIES)),
  body("requiredSkills").optional({ values: "falsy" }).isArray(),
  body("budget").isNumeric(),
  body("budgetType").optional().isIn(["fixed", "negotiable"]),
  body("urgency").optional().isIn(Object.values(JOB_URGENCY)),
  body("locationMode").optional().isIn(["remote", "onsite", "hybrid"])
];

export const applyJobValidator = [
  body("message").trim().notEmpty(),
  body("expectedPrice").optional().isNumeric()
];

export const decisionJobApplicationValidator = [
  body("decision").isIn(["ACCEPTED", "REJECTED"]),
  body("reason").optional().trim().isLength({ min: 2 })
];

export const updateJobStatusValidator = [
  body("status").isIn(Object.values(JOB_STATUS)),
  body("note").optional().trim().isLength({ min: 2 })
];

export const disputeJobValidator = [body("reason").trim().isLength({ min: 8 })];
