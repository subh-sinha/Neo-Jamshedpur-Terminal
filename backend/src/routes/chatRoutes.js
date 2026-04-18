import { Router } from "express";
import { getMessages, getRooms, initiateRoom, sendMessage } from "../controllers/chatController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.use(protect);

router.get("/", getRooms);
router.post("/", initiateRoom);
router.get("/:roomId", getMessages);
router.post("/:roomId/messages", sendMessage);

export default router;
