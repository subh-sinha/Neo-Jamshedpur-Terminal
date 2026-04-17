import "dotenv/config";
import http from "http";
import { Server } from "socket.io";
import { connectDb } from "./config/db.js";
import { createApp } from "./app.js";
import { setSocketServer } from "./services/notificationService.js";

const PORT = process.env.PORT || 5000;

async function bootstrap() {
  await connectDb(process.env.MONGODB_URI);
  const app = createApp();
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL
    }
  });

  io.on("connection", (socket) => {
    socket.on("auth:join", (userId) => {
      socket.join(String(userId));
    });
  });

  setSocketServer(io);
  server.listen(PORT, () => {
    console.log(`Neo-Jamshedpur API listening on port ${PORT}`);
  });
}

bootstrap().catch((error) => {
  console.error("Failed to boot server", error);
  process.exit(1);
});
