import { Router } from 'express';
import db from '../db.js';
import { requireAuth } from '../middleware/auth.js';
import crypto from 'crypto';

const router = Router();

router.get('/', requireAuth, (req, res) => {
  const list = db.prepare('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC').all(req.user.sub);
  res.json(list.map(o => ({ ...o, items: JSON.parse(o.items_json) })));
});

router.post('/', requireAuth, (req, res) => {
  const { items, amount } = req.body;
  if (!Array.isArray(items) || typeof amount !== 'number') {
    return res.status(400).json({ message: 'Invalid payload' });
  }
  const id = 'ord_' + crypto.randomBytes(6).toString('hex');
  db.prepare('INSERT INTO orders (id, user_id, items_json, amount, status) VALUES (?, ?, ?, ?, ?)')
    .run(id, req.user.sub, JSON.stringify(items), amount, 'processing');
  res.json({ id, status: 'processing' });
});

export default router;