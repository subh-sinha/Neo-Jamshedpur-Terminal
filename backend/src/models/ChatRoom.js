import mongoose from "mongoose";

const chatRoomSchema = new mongoose.Schema(
  {
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }],
    contextType: { type: String, enum: ["Job", "Trade"], required: false },
    contextEntity: { type: mongoose.Schema.Types.ObjectId, required: false },
    contextTitle: { type: String, required: false },
    lastMessage: { type: String, default: "" },
    lastMessageAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export const ChatRoom = mongoose.model("ChatRoom", chatRoomSchema);
