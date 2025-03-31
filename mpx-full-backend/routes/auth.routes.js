import express from "express";
import { registerUser, loginUser } from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
const router = express.Router();

// POST /api/auth/register
router.post("/register", registerUser);

// POST /api/auth/login
router.post("/login", loginUser);

// GET /api/auth/me
router.get("/me", verifyToken, (req, res) => {
  res.json(req.user); // Responding with the user's data
});

export default router;
