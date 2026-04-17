import { Notification } from "../models/Notification.js";

let ioInstance = null;

export function setSocketServer(io) {
  ioInstance = io;
}

export function emitRealtime(event, payload) {
  if (ioInstance) {
    ioInstance.emit(event, payload);
  }
}

export async function notifyUser(payload) {
  const notification = await Notification.create(payload);
  if (ioInstance) {
    ioInstance.to(String(payload.user)).emit("notification:new", notification);
  }
  return notification;
}

export async function notifyMany(userIds, payload) {
  return Promise.all(
    userIds.map((userId) =>
      notifyUser({
        ...payload,
        user: userId
      })
    )
  );
}
