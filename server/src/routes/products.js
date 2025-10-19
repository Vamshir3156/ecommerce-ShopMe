import { Router } from "express";
import db from "../db.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = Router();

router.get("/", (req, res) => {
  const { q } = req.query;
  if (q && q.trim()) {
    const like = `%${q.trim()}%`;
    const stmt = db.prepare(
      `SELECT * FROM products
       WHERE title LIKE ? OR description LIKE ? OR category LIKE ?`
    );
    const list = stmt.all(like, like, like);
    return res.json(list);
  }
  const list = db.prepare("SELECT * FROM products").all();
  res.json(list);
});

router.get("/:id", (req, res) => {
  const item = db
    .prepare("SELECT * FROM products WHERE id = ?")
    .get(req.params.id);
  if (!item) return res.status(404).json({ message: "Not found" });
  res.json(item);
});

router.post("/", requireAuth, requireAdmin, (req, res) => {
  const { id, title, description, image, price, category, stock, rating } =
    req.body;
  const stmt = db.prepare(
    "INSERT INTO products (id, title, description, image, price, category, stock, rating) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
  );
  stmt.run(
    id,
    title,
    description,
    image,
    price,
    category,
    stock ?? 10,
    rating ?? 4.5
  );
  res.json({ message: "Created" });
});

router.put("/:id", requireAuth, requireAdmin, (req, res) => {
  const { title, description, image, price, category, stock, rating } =
    req.body;
  const stmt = db.prepare(`UPDATE products SET 
    title = COALESCE(?, title),
    description = COALESCE(?, description),
    image = COALESCE(?, image),
    price = COALESCE(?, price),
    category = COALESCE(?, category),
    stock = COALESCE(?, stock),
    rating = COALESCE(?, rating)
    WHERE id = ?`);
  stmt.run(
    title,
    description,
    image,
    price,
    category,
    stock,
    rating,
    req.params.id
  );
  res.json({ message: "Updated" });
});

router.delete("/:id", requireAuth, requireAdmin, (req, res) => {
  db.prepare("DELETE FROM products WHERE id = ?").run(req.params.id);
  res.json({ message: "Deleted" });
});

export default router;
