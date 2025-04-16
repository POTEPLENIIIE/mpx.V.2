// controllers/auth.controller.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import crypto from "crypto";
import { sendEmail } from "../utils/mailer.js";

export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email вже використовується" });

    // 👉 ХЕШУЄМО ПАРОЛЬ
    const hashedPassword = await bcrypt.hash(password, 10);

    const token = crypto.randomBytes(32).toString("hex");

    const newUser = new User({
      username,
      email,
      password: hashedPassword, // 👈 ось тут уже хеш
      emailVerificationToken: token
    });

    await newUser.save();

    const verifyLink = `https://minecraftprojectx.com/verify-email?token=${token}`;
    await sendEmail(email, "Підтвердження пошти", `
      <h2>Ласкаво просимо!</h2>
      <p>Підтвердьте свою пошту, натиснувши на це посилання:</p>
      <a href="${verifyLink}">${verifyLink}</a>
    `);

    res.status(201).json({ message: "Реєстрація успішна. Перевірте пошту." });
  } catch (error) {
    res.status(500).json({ message: "Помилка при реєстрації", error });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    const user = await User.findOne({ emailVerificationToken: token });

    if (!user) {
      return res.status(400).json({ message: "Невірний або протермінований токен" });
    }

    user.emailVerificationToken = undefined;
    user.isEmailVerified = true;
    await user.save();

    res.status(200).json({ message: "Пошта підтверджена успішно" });
  } catch (error) {
    res.status(500).json({ message: "Помилка при підтвердженні пошти", error });
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
      username: user.username,
      isEmailVerified: user.isEmailVerified, // 👉 додай це, щоб фронт знав
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

export const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Користувача не знайдено" });
    if (user.isEmailVerified) return res.status(400).json({ message: "Пошта вже підтверджена" });

    const token = crypto.randomBytes(32).toString("hex");
    user.emailVerificationToken = token;
    await user.save();

    const verifyLink = `https://minecraftprojectx.com/verify-email?token=${token}`;

    await sendEmail(email, "Підтвердження пошти", `
      <h2>Повторне підтвердження</h2>
      <p>Натисніть щоб підтвердити:</p>
      <a href="${verifyLink}">${verifyLink}</a>
    `);

    res.json({ message: "Посилання повторно надіслано на пошту" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Помилка при надсиланні листа" });
  }
};

export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Користувача з таким email не знайдено" });

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = Date.now() + 3600000; // 1 година
    await user.save();

    const resetLink = `https://minecraftprojectx.com/reset-password?token=${resetToken}`;
    await sendEmail(email, "Скидання паролю", `
      <h2>Скидання паролю</h2>
      <p>Натисніть на посилання нижче, щоб встановити новий пароль:</p>
      <a href="${resetLink}">${resetLink}</a>
    `);

    res.json({ message: "Лист із посиланням на зміну паролю відправлено" });
  } catch (error) {
    console.error("❌ Помилка скидання паролю:", error);
    res.status(500).json({ message: "Помилка при надсиланні листа для скидання паролю" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "Невірний або протермінований токен" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.json({ message: "Пароль успішно змінено" });
  } catch (error) {
    console.error("❌ Помилка оновлення паролю:", error);
    res.status(500).json({ message: "Помилка сервера" });
  }
};



