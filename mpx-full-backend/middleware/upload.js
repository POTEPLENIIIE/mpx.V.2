// middleware/upload.js
import multer from "multer";
import path from "path";
import fs from "fs";

// Створюємо директорію, якщо не існує
const dir = "uploads/avatars";
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/avatars");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${req.user.username}_Avatar${ext}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/jpg") {
    cb(null, true);
  } else {
    cb(new Error("Дозволено лише JPG"), false);
  }
};

const upload = multer({ storage, fileFilter });

export default upload;
