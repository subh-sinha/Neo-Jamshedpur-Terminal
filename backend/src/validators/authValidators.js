import { body } from "express-validator";

export const registerValidator = [
  body("fullName").trim().notEmpty(),
  body("username").trim().isLength({ min: 3 }),
  body("email").isEmail(),
  body("password").isLength({ min: 6 })
];

export const loginValidator = [body("email").isEmail(), body("password").notEmpty()];
