import { Router } from "express";
import { getNotifications, markAllNotificationsRead, markNotificationRead } from "../controllers/notificationController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.get("/", protect, getNotifications);
router.post("/read-all", protect, markAllNotificationsRead);
router.post("/read/:id", protect, markNotificationRead);

export default router;
