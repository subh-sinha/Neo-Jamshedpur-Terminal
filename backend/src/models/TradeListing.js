import mongoose from "mongoose";
import { TRADE_STATUS } from "../constants/enums.js";

const tradeListingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    itemType: { type: String, enum: ["physical", "digital", "service"], default: "physical" },
    condition: String,
    quantity: { type: Number, default: 1 },
    images: [String],
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    expectedExchange: String,
    negotiable: { type: Boolean, default: true },
    status: {
      type: String,
      enum: Object.values(TRADE_STATUS),
      default: TRADE_STATUS.LISTED
    },
    offers: [{ type: mongoose.Schema.Types.ObjectId, ref: "TradeOffer" }],
    acceptedOffer: { type: mongoose.Schema.Types.ObjectId, ref: "TradeOffer" },
    sector: String,
    dispute: { type: mongoose.Schema.Types.ObjectId, ref: "Dispute" }
  },
  { timestamps: true }
);

export const TradeListing = mongoose.model("TradeListing", tradeListingSchema);
