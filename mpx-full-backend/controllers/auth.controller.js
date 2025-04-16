// controllers/auth.controller.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const registerUser = async (req, res) => {
  try {
    const username = req.body?.username || "";
    const email = req.body?.email || "";
    const password = req.body?.password || "";

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Заповніть усі поля" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email вже використовується" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: "Гравець",
      balance: 0,
      avatar: "default-avatar.webp",
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Помилка реєстрації" });
  }
};


export const loginUser = async (req, res) => {
  try {
    const usernameOrEmail = req.body?.usernameOrEmail || "";
    const password = req.body?.password || "";

    if (!usernameOrEmail || !password) {
      return res.status(400).json({ message: "Введіть логін та пароль" });
    }

    let user;
    if (usernameOrEmail.includes("@")) {
      user = await User.findOne({ email: usernameOrEmail });
    } else {
      user = await User.findOne({ username: usernameOrEmail });
    }

    if (!user) {
      return res.status(400).json({ message: "Користувача не знайдено" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Невірний пароль" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      token,
      username: user.username, // 👈 це обов’язково
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Помилка авторизації" });
  }
};



export const getUserData = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); // Не передаємо пароль
    if (!user) {
      return res.status(404).json({ message: "Користувача не знайдено" });
    }
    res.json(user); // Повертаємо дані користувача
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ message: "Помилка сервера" });
  }
};
