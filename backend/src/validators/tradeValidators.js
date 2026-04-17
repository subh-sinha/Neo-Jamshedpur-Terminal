import { body } from "express-validator";

export const createTradeValidator = [
  body("title").trim().notEmpty(),
  body("description").trim().notEmpty(),
  body("category").trim().notEmpty()
];

export const makeOfferValidator = [body("offeredValue").trim().notEmpty()];
