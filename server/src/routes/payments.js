// ✅ Load environment variables before anything else
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "..", "..", ".env") });

import { Router } from "express";
import Stripe from "stripe";
import db from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// ✅ Initialize Stripe safely after .env is loaded
const STRIPE_KEY = process.env.STRIPE_SECRET_KEY;
if (!STRIPE_KEY) {
  console.error("❌ Stripe key missing — check server/.env");
  throw new Error("Missing STRIPE_SECRET_KEY in .env");
}
const stripe = new Stripe(STRIPE_KEY);
console.log("✅ Stripe key prefix:", STRIPE_KEY.slice(0, 10));

// Function to safely calculate total amount in cents
function computeAmount(items) {
  let total = 0;
  for (const it of items) {
    const p = db.prepare("SELECT price FROM products WHERE id = ?").get(it.id);
    if (!p) throw new Error(`Product not found: ${it.id}`);
    total += Math.round(Number(p.price) * 100) * (it.qty ?? 1);
  }
  return total;
}

// POST /api/payments/create-intent
router.post("/create-intent", requireAuth, async (req, res) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "No items provided" });
    }
    const amount = computeAmount(items);
    const intent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      metadata: { userId: req.user.sub },
    });
    res.json({ clientSecret: intent.client_secret });
  } catch (e) {
    console.error("Payment error:", e);
    res.status(400).json({ message: e.message });
  }
});

export default router;
