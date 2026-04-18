import { StatusCodes } from "http-status-codes";
import { ChatRoom } from "../models/ChatRoom.js";
import { Message } from "../models/Message.js";
import { AppError } from "../utils/appError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { emitRealtime, notifyUser } from "../services/notificationService.js";
import { NOTIFICATION_CATEGORY, PRIORITY } from "../constants/enums.js";

export const getRooms = asyncHandler(async (req, res) => {
  const rooms = await ChatRoom.find({ participants: req.user._id })
    .populate("participants", "fullName username avatar")
    .sort({ lastMessageAt: -1 });
  res.json(rooms);
});

export const getMessages = asyncHandler(async (req, res) => {
  const room = await ChatRoom.findById(req.params.roomId);
  if (!room) throw new AppError("Chat room not found", StatusCodes.NOT_FOUND);
  if (!room.participants.some((participantId) => String(participantId) === String(req.user._id))) {
    throw new AppError("Not a participant in this room", StatusCodes.FORBIDDEN);
  }

  const messages = await Message.find({ room: room._id })
    .populate("sender", "fullName username avatar")
    .sort({ createdAt: 1 });

  res.json(messages);
});

export const initiateRoom = asyncHandler(async (req, res) => {
  const { targetUserId, contextType, contextEntity, contextTitle } = req.body;
  if (String(targetUserId) === String(req.user._id)) {
    throw new AppError("Cannot create a chat with yourself", StatusCodes.BAD_REQUEST);
  }

  // Check if a room already exists for this exact context or between these users
  const filter = {
    participants: { $all: [req.user._id, targetUserId] }
  };
  if (contextEntity) {
    filter.contextEntity = contextEntity;
  }

  let room = await ChatRoom.findOne(filter).populate("participants", "fullName username avatar");

  if (!room) {
    room = await ChatRoom.create({
      participants: [req.user._id, targetUserId],
      contextType,
      contextEntity,
      contextTitle
    });
    room = await ChatRoom.findById(room._id).populate("participants", "fullName username avatar");
  }

  res.json(room);
});

export const sendMessage = asyncHandler(async (req, res) => {
  const { content } = req.body;
  if (!content || !content.trim()) {
    throw new AppError("Message content is required", StatusCodes.BAD_REQUEST);
  }

  const room = await ChatRoom.findById(req.params.roomId);
  if (!room) throw new AppError("Chat room not found", StatusCodes.NOT_FOUND);
  if (!room.participants.some((participantId) => String(participantId) === String(req.user._id))) {
    throw new AppError("Not a participant in this room", StatusCodes.FORBIDDEN);
  }

  const message = await Message.create({
    room: room._id,
    sender: req.user._id,
    content
  });

  room.lastMessage = content;
  room.lastMessageAt = new Date();
  await room.save();

  const populatedMessage = await Message.findById(message._id).populate("sender", "fullName username avatar");

  const targetUserId = room.participants.find((id) => String(id) !== String(req.user._id));
  
  // Emit realtime event
  emitRealtime("chat:message", populatedMessage);

  // Send notification to the other user
  await notifyUser({
    user: targetUserId,
    title: `New message from ${req.user.fullName}`,
    message: content,
    category: NOTIFICATION_CATEGORY.CHAT,
    priority: PRIORITY.NORMAL,
    link: `/chat/${room._id}`
  });

  res.status(201).json(populatedMessage);
});
