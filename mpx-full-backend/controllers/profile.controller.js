import fs from "fs";
import path from "path";
import User from "../models/User.js";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Для `__dirname` в ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const getUserData = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password").lean();
    if (!user) {
      return res.status(404).json({ message: "Користувача не знайдено" });
    }

    // Додаємо повний шлях до аватарки
    user.avatarUrl = `/uploads/avatars/${user.avatar}`;

    res.json(user);
  } catch (error) {
    console.error("Помилка сервера:", error);
    res.status(500).json({ message: "Помилка сервера" });
  }
};

export const updateAvatar = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user)
      return res.status(404).json({ message: "Користувача не знайдено" });

    if (!req.file)
      return res.status(400).json({ message: "Файл не завантажено" });

    const newFilename = req.file.filename;

    // 💾 Зберігаємо нового аватара в базу
    const oldFilename = user.avatar;
    user.avatar = newFilename;
    await user.save();

    // 🧹 Видаляємо попередній (після збереження нового)
    if (oldFilename && oldFilename !== "default-avatar.webp") {
      const oldPath = path.join(
        __dirname,
        "..",
        "uploads",
        "avatars",
        oldFilename
      );
      if (fs.existsSync(oldPath)) {
        fs.unlink(oldPath, (err) => {
          if (err) console.error("❌ Помилка видалення старого аватара:", err);
          else console.log("🧹 Старий аватар видалено:", oldFilename);
        });
      }
    }

    console.log("✅ Збережено avatar у базі:", user.avatar);
    res.json({ message: "Аватар оновлено", avatar: user.avatar });
  } catch (err) {
    console.error("❌ Помилка при оновленні аватара:", err);
    res.status(500).json({ message: "Помилка сервера" });
  }
};
