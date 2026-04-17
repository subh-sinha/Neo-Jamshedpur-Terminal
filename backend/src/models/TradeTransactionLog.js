import mongoose from "mongoose";

const tradeTransactionLogSchema = new mongoose.Schema(
  {
    trade: { type: mongoose.Schema.Types.ObjectId, ref: "TradeListing", required: true },
    offer: { type: mongoose.Schema.Types.ObjectId, ref: "TradeOffer" },
    action: { type: String, required: true },
    actor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    note: String
  },
  { timestamps: true }
);

export const TradeTransactionLog = mongoose.model("TradeTransactionLog", tradeTransactionLogSchema);
