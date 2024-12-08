import express from "express";
import {
  login,
  logOut,
  signUp,
  verifyEmail,
  forgotPassword,
  resetPassword,
  checkAuth,
  reSendVerifyCode,
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", login);
router.post("/verify-email", verifyEmail);
router.post("/resend-code", reSendVerifyCode);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.get("/logout", logOut);
router.get("/check-auth", verifyToken, checkAuth);

export default router;
