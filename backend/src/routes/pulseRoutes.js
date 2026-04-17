import { Router } from "express";
import {
  bookmarkPulsePost,
  createPulsePost,
  deletePulsePost,
  getPulsePost,
  getPulsePosts,
  getPulseHistory,
  getSavedPulsePosts,
  moderatePulsePost,
  reactPulsePost,
  updatePulsePost
} from "../controllers/pulseController.js";
import { protect } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { createPulseValidator } from "../validators/pulseValidators.js";

const router = Router();

router.get("/", getPulsePosts);
router.get("/saved/me", protect, getSavedPulsePosts);
router.get("/history/me", protect, getPulseHistory);
router.post("/", protect, createPulseValidator, validate, createPulsePost);
router.post("/:id/moderate", protect, moderatePulsePost);
router.get("/:id", getPulsePost);
router.put("/:id", protect, updatePulsePost);
router.delete("/:id", protect, deletePulsePost);
router.post("/:id/react", protect, reactPulsePost);
router.post("/:id/bookmark", protect, bookmarkPulsePost);

export default router;
