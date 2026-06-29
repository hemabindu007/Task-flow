import { Router } from "express";
import {
  register,
  login,
  forgotPassword,
  verifyEmail,
  verifyRegistration,
  resetPassword,
  getMe,
} from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/verify-email", verifyEmail);
router.post("/verify-registration", verifyRegistration);
router.post("/reset-password", resetPassword);
router.get("/me", authenticate, getMe);

export default router;
