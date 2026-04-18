import { Router } from "express";
import {
  acceptOfferController,
  completeTradeController,
  counterOfferController,
  createOffer,
  createTrade,
  deleteTrade,
  disputeTrade,
  getNegotiation,
  getTrade,
  getTrades,
  myTrades,
  rejectOfferController,
  tradeHistory,
  updateTrade
} from "../controllers/tradeController.js";
import { protect } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { createTradeValidator, makeOfferValidator } from "../validators/tradeValidators.js";

const router = Router();

router.get("/", getTrades);
router.post("/", protect, createTradeValidator, validate, createTrade);
router.get("/mine/listings", protect, myTrades);
router.get("/history/all", protect, tradeHistory);
router.get("/:id", protect, getTrade);
router.put("/:id", protect, updateTrade);
router.delete("/:id", protect, deleteTrade);
router.post("/:id/offers", protect, makeOfferValidator, validate, createOffer);
router.get("/:id/offers/:offerId", protect, getNegotiation);
router.post("/:id/offers/:offerId/counter", protect, counterOfferController);
router.post("/:id/offers/:offerId/accept", protect, acceptOfferController);
router.post("/:id/offers/:offerId/reject", protect, rejectOfferController);
router.post("/:id/complete", protect, completeTradeController);
router.post("/:id/dispute", protect, disputeTrade);

export default router;
