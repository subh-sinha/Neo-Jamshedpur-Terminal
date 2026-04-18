import { Router } from "express";
import { login, logout, me, register, updateProfile, resetPassword } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { loginValidator, registerValidator } from "../validators/authValidators.js";

const router = Router();

router.post("/register", registerValidator, validate, register);
router.post("/login", loginValidator, validate, login);
router.get("/me", protect, me);
router.put("/profile", protect, updateProfile);
router.post("/logout", protect, logout);
router.post("/reset-password", resetPassword);

export default router;
