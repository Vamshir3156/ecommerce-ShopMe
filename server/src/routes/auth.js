import { Router } from "express";
import db from "../db.js";
import bcrypt from "bcryptjs";
const { compareSync, hashSync } = bcrypt;
import { signAccessToken, signRefreshToken, verifyToken } from "../utils.js";
import crypto from "crypto";

const router = Router();

const setAuthCookies = (res, access, refresh) => {
  const isProd = process.env.NODE_ENV === "production";
  res.cookie("access_token", access, {
    httpOnly: true,
    sameSite: isProd ? "none" : "lax",
    secure: isProd,
    maxAge: 1000 * 60 * 60,
  });
  res.cookie("refresh_token", refresh, {
    httpOnly: true,
    sameSite: isProd ? "none" : "lax",
    secure: isProd,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });
};

router.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ message: "Missing fields" });
  const existing = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
  if (existing)
    return res.status(409).json({ message: "Email already exists" });
  const id = "u_" + crypto.randomBytes(6).toString("hex");
  const hash = hashSync(password, 10);
  db.prepare(
    "INSERT INTO users (id, name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)"
  ).run(id, name, email, hash, "user");
  return res.json({ message: "Registered. You can login now." });
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
  if (!user) return res.status(401).json({ message: "Invalid credentials" });
  if (!compareSync(password, user.password_hash))
    return res.status(401).json({ message: "Invalid credentials" });

  const access = signAccessToken(
    { sub: user.id, email: user.email, role: user.role, name: user.name },
    process.env.JWT_ACCESS_SECRET,
    process.env.ACCESS_TOKEN_EXPIRES || "15m"
  );
  const refresh = signRefreshToken(
    { sub: user.id },
    process.env.JWT_REFRESH_SECRET,
    process.env.REFRESH_TOKEN_EXPIRES || "7d"
  );
  setAuthCookies(res, access, refresh);
  res.json({
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
});

router.post("/refresh", (req, res) => {
  try {
    const token = req.cookies?.refresh_token;
    if (!token) return res.status(401).json({ message: "No refresh token" });
    const decoded = verifyToken(token, process.env.JWT_REFRESH_SECRET);
    const user = db
      .prepare("SELECT id, name, email, role FROM users WHERE id = ?")
      .get(decoded.sub);
    if (!user) return res.status(401).json({ message: "User not found" });
    const access = signAccessToken(
      { sub: user.id, email: user.email, role: user.role, name: user.name },
      process.env.JWT_ACCESS_SECRET,
      process.env.ACCESS_TOKEN_EXPIRES || "15m"
    );
    const refresh = signRefreshToken(
      { sub: user.id },
      process.env.JWT_REFRESH_SECRET,
      process.env.REFRESH_TOKEN_EXPIRES || "7d"
    );
    setAuthCookies(res, access, refresh);
    res.json({ user });
  } catch {
    res.status(401).json({ message: "Invalid refresh token" });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("access_token");
  res.clearCookie("refresh_token");
  res.json({ message: "Logged out" });
});

router.get("/me", (req, res) => {
  try {
    const token = req.cookies?.access_token;
    if (!token) return res.status(200).json({ user: null });
    const decoded = verifyToken(token, process.env.JWT_ACCESS_SECRET);
    const user = db
      .prepare("SELECT id, name, email, role FROM users WHERE id = ?")
      .get(decoded.sub);
    res.json({ user });
  } catch {
    res.json({ user: null });
  }
});

export default router;
