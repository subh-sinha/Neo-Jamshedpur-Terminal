import { Router } from "express";
import { analytics, getUsers, resolveDispute, sendAlert, verifyUser } from "../controllers/adminController.js";
import { authorize, protect } from "../middleware/auth.js";
import { USER_ROLES } from "../constants/enums.js";

const router = Router();

router.use(protect, authorize(USER_ROLES.ADMIN));
router.get("/analytics", analytics);
router.get("/users", getUsers);
router.post("/users/:id/verify", verifyUser);
router.post("/alerts", sendAlert);
router.post("/disputes/:id/resolve", resolveDispute);

export default router;
