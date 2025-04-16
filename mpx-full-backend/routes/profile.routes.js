import express from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import {
  getUserData,
  updateAvatar,
} from "../controllers/profile.controller.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// ✅ Отримання даних користувача
router.get("/me", verifyToken, getUserData);

// ✅ Завантаження аватара
router.post(
  "/avatar",
  verifyToken,
  async (req, res, next) => {
    upload.single("avatar")(req, res, (err) => {
      if (err) {
        console.error("❌ Multer hard fail:", err.message);
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  },
  updateAvatar
);


// 👇 ES module — треба явно експортувати
export default router;
