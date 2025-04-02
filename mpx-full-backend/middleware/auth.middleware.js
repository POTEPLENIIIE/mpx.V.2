// middleware/auth.middleware.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Немає токена" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select(
      "username email avatar role balance"
    );
    if (!req.user) {
      return res.status(404).json({ message: "Користувача не знайдено" });
    }
    next();
  } catch (err) {
    console.error(err);
    res.status(403).json({ message: "Невірний токен" });
  }
};
