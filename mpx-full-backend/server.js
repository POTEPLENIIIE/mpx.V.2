import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import https from "https";
import fs from "fs";

// Імпортуємо middleware для перевірки токену
import { verifyToken } from "./middleware/auth.middleware.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: "https://minecraftprojectx.com",
  credentials: true
}));


app.use("/api/profile", (req, res, next) => {
  console.log("📥 Headers:", req.headers);
  next();
});
app.post("*", (req, res, next) => {
  console.log("📩 POST запит на:", req.originalUrl);
  next();
});


app.use(express.json());

// Маршрути для авторизації
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);

// Налаштовуємо статичні файли для аватарів

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// Обробка помилок, зокрема від multer
app.use((err, req, res, next) => {
  console.error("❌ GLOBAL ERROR 🔥");
  console.error("💥 Error type:", err?.name);
  console.error("💬 Error message:", err?.message);
  console.error("📥 mimetype:", req?.file?.mimetype || "файл не передано");

  res.status(400).json({ message: err.message || "Помилка завантаження" });
});



// Маршрут для отримання даних користувача (перевіряємо токен перед обробкою)
app.get("/api/auth/me", verifyToken, (req, res) => {
  res.json(req.user); // Відправляємо дані користувача
});

app.listen(4000, '0.0.0.0', () => {
  console.log("Server running on http://localhost:4000");
});


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log(`Connected to database on port ${PORT}`);
  })
  .catch((err) => console.error("DB connection error:", err));
