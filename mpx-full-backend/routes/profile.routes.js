import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { v4 as uuidv4 } from "uuid";

import { verifyToken } from "../middleware/auth.middleware.js";
import {
  getUserData,
  updateAvatar,
} from "../controllers/profile.controller.js";

const router = express.Router();

// 🔧 __dirname для ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ⚙️ Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/avatars");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueName = `${req.user.username}_${uuidv4()}${ext}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  fileFilter(req, file, cb) {
    if (
      !file.mimetype.includes("jpeg") &&
      !file.mimetype.includes("jpg") &&
      !file.mimetype.includes("image/jpeg")
    ) {
      return cb(new Error("Дозволені тільки JPEG зображення"));
    }
    cb(null, true);
  },
});

// ✅ Отримання даних користувача
router.get("/me", verifyToken, getUserData);

// ✅ Завантаження аватара
router.post("/avatar", verifyToken, upload.single("avatar"), updateAvatar);

// 👇 ES module — треба явно експортувати
export default router;
