import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

import "./db.js";
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/products.js";
import orderRoutes from "./routes/orders.js";
import paymentsRoutes from "./routes/payments.js";

const app = express();
app.set("trust proxy", 1);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const parseEnvOrigins = () =>
  (
    process.env.CLIENT_ORIGINS ||
    process.env.CLIENT_ORIGIN ||
    "http://localhost:5173"
  )
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

const normalize = (o) => {
  try {
    const u = new URL(o);
    return `${u.protocol}//${u.host}`;
  } catch {
    return o.replace(/\/+$/, "");
  }
};

const STATIC_ALLOW = parseEnvOrigins().map(normalize);
const REGEX_ALLOW = [/\.vercel\.app$/i, /\.onrender\.com$/i];

const isAllowed = (origin) => {
  if (!origin) return true;
  const norm = normalize(origin);
  if (STATIC_ALLOW.includes(norm)) return true;
  try {
    const host = new URL(norm).host;
    return REGEX_ALLOW.some((re) => re.test(host));
  } catch {
    return false;
  }
};

const corsOptions = {
  origin(origin, cb) {
    cb(null, isAllowed(origin));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use((req, _res, next) => {
  if (req.headers.origin) console.log("Incoming Origin:", req.headers.origin);
  next();
});

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

app.use(
  "/images",
  helmet.crossOriginResourcePolicy({ policy: "cross-origin" }),
  express.static(path.join(__dirname, "public", "images"))
);

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentsRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log("API running on port:", port);
  console.log("CORS allowed origins:", STATIC_ALLOW);
});
