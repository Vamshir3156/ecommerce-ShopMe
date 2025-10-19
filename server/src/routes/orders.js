import { Router } from "express";
import db from "../db.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";
import crypto from "crypto";

const router = Router();

router.get("/", requireAuth, (req, res) => {
  const list = db
    .prepare("SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC")
    .all(req.user.sub);
  res.json(list.map((o) => ({ ...o, items: JSON.parse(o.items_json) })));
});

router.post("/", requireAuth, (req, res) => {
  const { items, amount } = req.body;
  if (!Array.isArray(items) || typeof amount !== "number") {
    return res.status(400).json({ message: "Invalid payload" });
  }
  const id = "ord_" + crypto.randomBytes(6).toString("hex");
  db.prepare(
    "INSERT INTO orders (id, user_id, items_json, amount, status) VALUES (?, ?, ?, ?, ?)"
  ).run(id, req.user.sub, JSON.stringify(items), amount, "processing");
  res.json({ id, status: "processing" });
});
router.get("/admin/all", requireAuth, requireAdmin, (req, res) => {
  const rows = db
    .prepare(
      `
    SELECT o.id, o.user_id, o.amount, o.status, o.created_at, o.items_json,
           u.email AS user_email
    FROM orders o
    JOIN users u ON u.id = o.user_id
    ORDER BY o.created_at DESC
    LIMIT 200
  `
    )
    .all();

  const out = rows.map((r) => ({
    id: r.id,
    user_id: r.user_id,
    user_email: r.user_email,
    amount: r.amount,
    status: r.status,
    created_at: r.created_at,
    items: JSON.parse(r.items_json || "[]"),
  }));

  res.json(out);
});

// GET /api/orders/admin/:id → single order detail (admin only)
router.get("/admin/:id", requireAuth, requireAdmin, (req, res) => {
  const r = db
    .prepare(
      `
    SELECT o.id, o.user_id, o.amount, o.status, o.created_at, o.items_json,
           u.email AS user_email
    FROM orders o
    JOIN users u ON u.id = o.user_id
    WHERE o.id = ?
  `
    )
    .get(req.params.id);

  if (!r) return res.status(404).json({ message: "Order not found" });

  res.json({
    id: r.id,
    user_id: r.user_id,
    user_email: r.user_email,
    amount: r.amount,
    status: r.status,
    created_at: r.created_at,
    items: JSON.parse(r.items_json || "[]"),
  });
});
export default router;
