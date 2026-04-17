import mongoose from "mongoose";
import { OFFER_STATUS } from "../constants/enums.js";

const threadEntrySchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true },
    offeredValue: String
  },
  { timestamps: true, _id: false }
);

const tradeOfferSchema = new mongoose.Schema(
  {
    trade: { type: mongoose.Schema.Types.ObjectId, ref: "TradeListing", required: true },
    proposer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    offeredValue: { type: String, required: true },
    note: String,
    status: { type: String, enum: Object.values(OFFER_STATUS), default: OFFER_STATUS.OPEN },
    thread: { type: [threadEntrySchema], default: [] }
  },
  { timestamps: true }
);

export const TradeOffer = mongoose.model("TradeOffer", tradeOfferSchema);
