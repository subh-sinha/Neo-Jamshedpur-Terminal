import { StatusCodes } from "http-status-codes";
import { NOTIFICATION_CATEGORY, OFFER_STATUS, PRIORITY, TRADE_STATUS, USER_ROLES } from "../constants/enums.js";
import { TradeListing } from "../models/TradeListing.js";
import { TradeOffer } from "../models/TradeOffer.js";
import { TradeTransactionLog } from "../models/TradeTransactionLog.js";
import { Dispute } from "../models/Dispute.js";
import { AppError } from "../utils/appError.js";
import { REPUTATION_EVENTS } from "../utils/reputation.js";
import { applyReputationChange } from "./reputationService.js";
import { notifyUser } from "./notificationService.js";
import { logActivity } from "./activityService.js";

export async function logTradeAction(payload) {
  return TradeTransactionLog.create(payload);
}

export async function makeOffer({ tradeId, user, offeredValue, note }) {
  const trade = await TradeListing.findById(tradeId);
  if (!trade) {
    throw new AppError("Trade not found", StatusCodes.NOT_FOUND);
  }
  if (String(trade.owner) === String(user._id)) {
    throw new AppError("You cannot offer on your own listing");
  }
  if ([TRADE_STATUS.CANCELLED, TRADE_STATUS.COMPLETED, TRADE_STATUS.DISPUTED, TRADE_STATUS.ARCHIVED].includes(trade.status)) {
    throw new AppError("This trade cannot receive offers");
  }

  const offer = await TradeOffer.create({
    trade: trade._id,
    proposer: user._id,
    offeredValue,
    note,
    thread: [{ author: user._id, message: note || "Initial offer", offeredValue }]
  });

  trade.offers.push(offer._id);
  trade.status = TRADE_STATUS.OFFER_MADE;
  await trade.save();
  await logTradeAction({ trade: trade._id, offer: offer._id, action: "offer_made", actor: user._id, note });

  await notifyUser({
    user: trade.owner,
    title: "New trade offer",
    message: `${user.fullName} made an offer on ${trade.title}`,
    category: NOTIFICATION_CATEGORY.TRADE,
    priority: PRIORITY.HIGH,
    link: `/trades/${trade._id}/offers/${offer._id}`
  });

  return offer;
}

export async function counterOffer({ tradeId, offerId, user, message, offeredValue }) {
  const trade = await TradeListing.findById(tradeId);
  const offer = await TradeOffer.findById(offerId);
  if (!trade || !offer || String(offer.trade) !== String(trade._id)) {
    throw new AppError("Trade or offer not found", StatusCodes.NOT_FOUND);
  }
  const canRespond =
    String(offer.proposer) === String(user._id) || String(trade.owner) === String(user._id) || user.role === USER_ROLES.ADMIN;
  if (!canRespond) {
    throw new AppError("You cannot respond to this offer", StatusCodes.FORBIDDEN);
  }

  offer.status = OFFER_STATUS.COUNTERED;
  offer.thread.push({ author: user._id, message, offeredValue });
  if (offeredValue) {
    offer.offeredValue = offeredValue;
  }
  await offer.save();

  trade.status = TRADE_STATUS.NEGOTIATION;
  await trade.save();
  await logTradeAction({ trade: trade._id, offer: offer._id, action: "counter_offer", actor: user._id, note: message });

  const recipient = String(offer.proposer) === String(user._id) ? trade.owner : offer.proposer;
  await notifyUser({
    user: recipient,
    title: "Counter-offer received",
    message,
    category: NOTIFICATION_CATEGORY.TRADE,
    link: `/trades/${trade._id}/offers/${offer._id}`
  });

  return offer;
}

export async function acceptOffer({ tradeId, offerId, user }) {
  const trade = await TradeListing.findById(tradeId);
  const offer = await TradeOffer.findById(offerId);
  if (!trade || !offer || String(offer.trade) !== String(trade._id)) {
    throw new AppError("Trade or offer not found", StatusCodes.NOT_FOUND);
  }
  if (String(trade.owner) !== String(user._id) && user.role !== USER_ROLES.ADMIN) {
    throw new AppError("Only the trade owner can accept offers", StatusCodes.FORBIDDEN);
  }

  trade.acceptedOffer = offer._id;
  trade.status = TRADE_STATUS.ACCEPTED;
  offer.status = OFFER_STATUS.ACCEPTED;
  await Promise.all([trade.save(), offer.save()]);
  await logTradeAction({ trade: trade._id, offer: offer._id, action: "offer_accepted", actor: user._id });

  await notifyUser({
    user: offer.proposer,
    title: "Offer accepted",
    message: `Your offer on ${trade.title} has been accepted`,
    category: NOTIFICATION_CATEGORY.TRADE,
    priority: PRIORITY.HIGH,
    link: `/trades/${trade._id}/offers/${offer._id}`
  });

  return trade;
}

export async function rejectOffer({ tradeId, offerId, user }) {
  const trade = await TradeListing.findById(tradeId);
  const offer = await TradeOffer.findById(offerId);
  if (!trade || !offer || String(offer.trade) !== String(trade._id)) {
    throw new AppError("Trade or offer not found", StatusCodes.NOT_FOUND);
  }
  if (String(trade.owner) !== String(user._id) && user.role !== USER_ROLES.ADMIN) {
    throw new AppError("Only the trade owner can reject offers", StatusCodes.FORBIDDEN);
  }
  offer.status = OFFER_STATUS.REJECTED;
  trade.status = TRADE_STATUS.DECLINED;
  await Promise.all([offer.save(), trade.save()]);
  await logTradeAction({ trade: trade._id, offer: offer._id, action: "offer_rejected", actor: user._id });
  return offer;
}

export async function completeTrade({ tradeId, user }) {
  const trade = await TradeListing.findById(tradeId);
  if (!trade) {
    throw new AppError("Trade not found", StatusCodes.NOT_FOUND);
  }
  const acceptedOffer = trade.acceptedOffer ? await TradeOffer.findById(trade.acceptedOffer) : null;
  const participant = [String(trade.owner), String(acceptedOffer?.proposer)].includes(String(user._id));
  if (!participant && user.role !== USER_ROLES.ADMIN) {
    throw new AppError("Only participants can complete trades", StatusCodes.FORBIDDEN);
  }
  trade.status = TRADE_STATUS.COMPLETED;
  await trade.save();
  await logTradeAction({ trade: trade._id, offer: trade.acceptedOffer, action: "trade_completed", actor: user._id });
  await applyReputationChange({
    userId: trade.owner,
    delta: REPUTATION_EVENTS.TRADE_COMPLETED,
    reason: "Completed trade",
    sourceType: "trade",
    sourceId: trade._id
  });
  if (acceptedOffer?.proposer) {
    await applyReputationChange({
      userId: acceptedOffer.proposer,
      delta: REPUTATION_EVENTS.TRADE_COMPLETED,
      reason: "Completed trade",
      sourceType: "trade",
      sourceId: trade._id
    });
  }
  return trade;
}

export async function createTradeDispute({ tradeId, user, reason }) {
  const trade = await TradeListing.findById(tradeId);
  if (!trade) {
    throw new AppError("Trade not found", StatusCodes.NOT_FOUND);
  }
  const dispute = await Dispute.create({
    entityType: "trade",
    entityId: trade._id,
    openedBy: user._id,
    againstUser: trade.owner,
    reason
  });
  trade.status = TRADE_STATUS.DISPUTED;
  trade.dispute = dispute._id;
  await trade.save();
  await logActivity({
    user: user._id,
    entityType: "trade",
    entityId: trade._id,
    action: "trade:disputed",
    summary: reason
  });
  return dispute;
}
