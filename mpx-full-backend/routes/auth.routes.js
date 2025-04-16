import express from "express";
import { registerUser, loginUser, verifyEmail, resendVerificationEmail } from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import { requestPasswordReset } from "../controllers/auth.controller.js"; // 🔹 імпортуємо функцію
import { resetPassword } from "../controllers/auth.controller.js";
const router = express.Router();

router.post("/reset-password", resetPassword);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/request-reset", requestPasswordReset);
router.get("/verify-email", verifyEmail);
router.post("/resend-email", resendVerificationEmail);
router.get("/me", verifyToken, (req, res) => {
  res.json(req.user);
});

export default router;
