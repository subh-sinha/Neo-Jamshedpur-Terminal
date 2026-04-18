import { TradeListing } from "../models/TradeListing.js";
import { TradeOffer } from "../models/TradeOffer.js";
import { TradeTransactionLog } from "../models/TradeTransactionLog.js";
import { USER_ROLES } from "../constants/enums.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { pick } from "../utils/pick.js";
import {
  acceptOffer,
  completeTrade,
  counterOffer,
  createTradeDispute,
  makeOffer,
  rejectOffer
} from "../services/tradeService.js";

function canViewOffer({ offer, tradeOwnerId, user }) {
  if (!user) return false;
  if (user.role === USER_ROLES.ADMIN) return true;
  return String(offer.proposer?._id || offer.proposer) === String(user._id) || String(tradeOwnerId) === String(user._id);
}

export const getTrades = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.category) filter.category = req.query.category;
  if (req.query.q) filter.title = { $regex: req.query.q, $options: "i" };
  const trades = await TradeListing.find(filter).populate("owner", "fullName username avatar reputationScore trustRank");
  res.json(trades);
});

export const createTrade = asyncHandler(async (req, res) => {
  const trade = await TradeListing.create({
    ...pick(req.body, [
      "title",
      "description",
      "category",
      "itemType",
      "condition",
      "quantity",
      "images",
      "expectedExchange",
      "negotiable",
      "sector"
    ]),
    owner: req.user._id
  });
  res.status(201).json(trade);
});

export const getTrade = asyncHandler(async (req, res) => {
  const trade = await TradeListing.findById(req.params.id)
    .populate("owner", "fullName username avatar reputationScore trustRank")
    .populate({
      path: "offers",
      populate: { path: "proposer", select: "fullName username avatar reputationScore trustRank" }
    });
  const history = await TradeTransactionLog.find({ trade: req.params.id }).populate("actor", "fullName username");
  const visibleOffers = (trade.offers || []).filter((offer) =>
    canViewOffer({ offer, tradeOwnerId: trade.owner?._id || trade.owner, user: req.user })
  );
  res.json({ ...trade.toObject(), offers: visibleOffers, history });
});

export const updateTrade = asyncHandler(async (req, res) => {
  const query = req.user.role === "admin" ? { _id: req.params.id } : { _id: req.params.id, owner: req.user._id };
  const trade = await TradeListing.findOneAndUpdate(query, { $set: req.body }, { new: true });
  res.json(trade);
});

export const deleteTrade = asyncHandler(async (req, res) => {
  const query = req.user.role === "admin" ? { _id: req.params.id } : { _id: req.params.id, owner: req.user._id };
  await TradeListing.findOneAndDelete(query);
  res.json({ message: "Trade deleted" });
});

export const createOffer = asyncHandler(async (req, res) => {
  const offer = await makeOffer({
    tradeId: req.params.id,
    user: req.user,
    offeredValue: req.body.offeredValue,
    note: req.body.note
  });
  res.status(201).json(offer);
});

export const counterOfferController = asyncHandler(async (req, res) => {
  const offer = await counterOffer({
    tradeId: req.params.id,
    offerId: req.params.offerId,
    user: req.user,
    message: req.body.message,
    offeredValue: req.body.offeredValue
  });
  res.json(offer);
});

export const acceptOfferController = asyncHandler(async (req, res) => {
  const trade = await acceptOffer({ tradeId: req.params.id, offerId: req.params.offerId, user: req.user });
  res.json(trade);
});

export const rejectOfferController = asyncHandler(async (req, res) => {
  const offer = await rejectOffer({ tradeId: req.params.id, offerId: req.params.offerId, user: req.user });
  res.json(offer);
});

export const completeTradeController = asyncHandler(async (req, res) => {
  const trade = await completeTrade({ tradeId: req.params.id, user: req.user });
  res.json(trade);
});

export const disputeTrade = asyncHandler(async (req, res) => {
  const dispute = await createTradeDispute({ tradeId: req.params.id, user: req.user, reason: req.body.reason });
  res.status(201).json(dispute);
});

export const myTrades = asyncHandler(async (req, res) => {
  const trades = await TradeListing.find({ owner: req.user._id });
  res.json(trades);
});

export const tradeHistory = asyncHandler(async (req, res) => {
  const history = await TradeTransactionLog.find().sort({ createdAt: -1 }).limit(40).populate("trade actor");
  res.json(history);
});

export const getNegotiation = asyncHandler(async (req, res) => {
  const trade = await TradeListing.findById(req.params.id);
  const offer = await TradeOffer.findById(req.params.offerId).populate("proposer", "fullName username avatar");
  if (!trade || !offer || String(offer.trade) !== String(trade._id)) {
    res.status(404).json({ message: "Trade or offer not found" });
    return;
  }
  if (!canViewOffer({ offer, tradeOwnerId: trade.owner, user: req.user })) {
    res.status(403).json({ message: "You cannot view this negotiation" });
    return;
  }
  res.json(offer);
});
