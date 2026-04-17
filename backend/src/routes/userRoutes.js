import { Router } from "express";
import { getUser, getUserActivity, getUserReputation } from "../controllers/userController.js";

const router = Router();

router.get("/:id", getUser);
router.get("/:id/activity", getUserActivity);
router.get("/:id/reputation", getUserReputation);

export default router;
