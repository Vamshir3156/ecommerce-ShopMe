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

// --- App must be created BEFORE any app.use(...) ---
const app = express();
app.set("trust proxy", 1);

// --- Path helpers ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---- CORS (robust allow-list + preview domains) ----
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
    return `${u.protocol}//${u.host}`; // protocol + host (with port)
  } catch {
    return o.replace(/\/+$/, ""); // strip trailing slash fallback
  }
};

const STATIC_ALLOW = parseEnvOrigins().map(normalize);
const REGEX_ALLOW = [/\.vercel\.app$/i, /\.onrender\.com$/i];

const isAllowed = (origin) => {
  if (!origin) return true; // allow curl/Postman/server-to-server
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
    cb(null, isAllowed(origin)); // ✅ never throws; just omits CORS headers when false
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// (Optional) log incoming Origin to debug
app.use((req, _res, next) => {
  if (req.headers.origin) console.log("Incoming Origin:", req.headers.origin);
  next();
});

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
// ---- end CORS ----

// --- Security / logs / parsers ---
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

// --- Static ---
// --- Static (allow cross-origin only for images) ---
app.use(
  "/images",
  // allow other origins to embed/consume these resources
  helmet.crossOriginResourcePolicy({ policy: "cross-origin" }),
  express.static(path.join(__dirname, "public", "images"))
);

// --- Healthcheck ---
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// --- Routes ---
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentsRoutes);

// --- Start server ---
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log("API running on port:", port);
  console.log("CORS allowed origins:", STATIC_ALLOW);
});
