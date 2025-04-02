import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Імпортуємо middleware для перевірки токену
import { verifyToken } from "./middleware/auth.middleware.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Маршрути для авторизації
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);

// Налаштовуємо статичні файли для аватарів

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Маршрут для отримання даних користувача (перевіряємо токен перед обробкою)
app.get("/api/auth/me", verifyToken, (req, res) => {
  res.json(req.user); // Відправляємо дані користувача
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log(`Connected to database on port ${PORT}`);
  })
  .catch((err) => console.error("DB connection error:", err));
