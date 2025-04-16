import fs from "fs";
import path from "path";
import User from "../models/User.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { v4 as uuidv4 } from "uuid";
import sharp from "sharp";

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
    console.log("🟢 ПОЧАТОК");

    const user = await User.findById(req.user.id);
    if (!user) {
      console.log("🔴 Користувача не знайдено");
      return res.status(404).json({ message: "Користувача не знайдено" });
    }

    if (!req.file) {
      console.log("🔴 Файл не передано");
      return res.status(400).json({ message: "Файл не завантажено" });
    }

    console.log("🧪 req.file:", req.file);

    const newFileName = `${user.username}_${uuidv4()}.jpg`;
    const finalPath = path.join("/var/www/mpx/uploads/avatars", newFileName);

    console.log("⚙️ Обробка sharp...");

    await sharp(req.file.path)
      .jpeg({ quality: 90 })
      .toFile(finalPath);

    console.log("✅ Файл конвертовано:", finalPath);

    fs.unlinkSync(req.file.path);

    const oldFilename = user.avatar;
    user.avatar = newFileName;
    await user.save();

    if (oldFilename && oldFilename !== "default-avatar.webp") {
      const oldPath = path.join("/var/www/mpx/uploads/avatars", oldFilename);
      if (fs.existsSync(oldPath)) {
        fs.unlink(oldPath, (err) => {
          if (err) console.error("❌ Видалення старого:", err);
          else console.log("🧹 Видалено старий файл:", oldFilename);
        });
      }
    }

    console.log("🟢 ВСЕ ОК, avatar збережено:", newFileName);
    res.json({ message: "Аватар оновлено", avatar: newFileName });

  } catch (err) {
    console.error("❌ ФАТАЛЬНА ПОМИЛКА:", err);
    res.status(500).json({ message: err.message || "Помилка завантаження" });
  }
};
