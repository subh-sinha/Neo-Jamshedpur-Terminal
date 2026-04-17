import { Router } from "express";
import {
  applyJob,
  cancelJob,
  createJob,
  decideJobApplicationController,
  deleteJob,
  disputeJob,
  getJob,
  getJobs,
  myApplications,
  myJobs,
  updateJob,
  updateJobStatusController
} from "../controllers/jobController.js";
import { protect } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { applyJobValidator, createJobValidator, decisionJobApplicationValidator, disputeJobValidator, updateJobStatusValidator } from "../validators/jobValidators.js";

const router = Router();

router.get("/", getJobs);
router.post("/", protect, createJobValidator, validate, createJob);
router.get("/mine/listings", protect, myJobs);
router.get("/mine/applications", protect, myApplications);
router.get("/:id", getJob);
router.put("/:id", protect, updateJob);
router.delete("/:id", protect, deleteJob);
router.post("/:id/apply", protect, applyJobValidator, validate, applyJob);
router.post("/:id/applications/:applicationId/decision", protect, decisionJobApplicationValidator, validate, decideJobApplicationController);
router.post("/:id/status", protect, updateJobStatusValidator, validate, updateJobStatusController);
router.post("/:id/dispute", protect, disputeJobValidator, validate, disputeJob);
router.post("/:id/cancel", protect, cancelJob);

export default router;
