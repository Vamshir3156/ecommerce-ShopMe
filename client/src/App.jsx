import { useEffect, useRef, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Home from "./pages/Home.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Profile from "./pages/Profile.jsx";
import Protected from "./components/Protected.jsx";
import AdminOrders from "./pages/admin/Orders.jsx";
import FreeShippingPage from "./pages/FreeShippingPage";
import EasyReturnsPage from "./pages/EasyReturnsPage";
import PaymentsPage from "./pages/PaymentsPage";
import SupportPage from "./pages/SupportPage";
import AdminGuard from "./components/AdminGuard.jsx";
import AdminProducts from "./pages/admin/Products.jsx";

const API_BASE = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

// small helper: fetch with a per-attempt timeout
async function fetchWithTimeout(url, ms = 6000) {
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(), ms);
  try {
    const res = await fetch(url, {
      credentials: "include",
      signal: ctrl.signal,
    });
    return res;
  } finally {
    clearTimeout(id);
  }
}

export default function App() {
  const [waking, setWaking] = useState(true);
  const [status, setStatus] = useState("Connecting to server…");

  // ⏱ countdown state: start 45s, extend +30s whenever it hits 5s
  const [remainingMs, setRemainingMs] = useState(45000);
  const extendLockRef = useRef(false); // prevents multiple +30s per <5s window

  // Countdown tick (only while waking)
  useEffect(() => {
    if (!waking) return;
    const t = setInterval(() => {
      setRemainingMs((prev) => {
        let next = Math.max(0, prev - 1000);

        // extend once when we cross into <=5s
        if (next <= 5000 && !extendLockRef.current) {
          extendLockRef.current = true;
          next += 30000; // +30s
        } else if (next > 5000 && extendLockRef.current) {
          // reset lock when we move back above 5s after an extension
          extendLockRef.current = false;
        }

        return next;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [waking]);

  // Poll until /api/health responds OK (no hard cap)
  useEffect(() => {
    let cancelled = false;

    const wakeServer = async () => {
      let attempt = 0;
      while (!cancelled) {
        attempt++;
        setStatus(`Connecting to server… (attempt ${attempt})`);
        try {
          const res = await fetchWithTimeout(`${API_BASE}/api/health`, 7000);
          if (res.ok) {
            // tiny UX delay
            await new Promise((r) => setTimeout(r, 400));
            if (!cancelled) {
              setWaking(false);
              // signal pages (Home, etc.) to refetch now that server is awake
              setTimeout(() => {
                window.dispatchEvent(new Event("server-ready"));
              }, 0);
            }
            return;
          }
        } catch {
          // ignore; keep retrying
        }

        // exponential-ish backoff: 0.5s, 1s, 2s, 3s, 4s (capped 4s)
        const delay = Math.min(4000, 500 * Math.pow(2, Math.min(attempt, 4)));
        setStatus(`Server waking up… Please Wait :)`);
        await new Promise((r) => setTimeout(r, delay));
      }
    };

    wakeServer();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      {waking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="rounded-2xl bg-white/95 p-5 shadow-xl w-[92%] max-w-sm text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <svg
                className="h-5 w-5 animate-spin text-gray-700"
                viewBox="0 0 24 24"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeOpacity="0.25"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  d="M22 12a10 10 0 0 1-10 10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
              <p className="font-medium text-gray-800">{status}</p>
            </div>

            <p className="text-sm text-gray-700 mb-1">
              ⏱️ Estimated time left:{" "}
              <span className="font-semibold text-gray-900">
                {Math.ceil(remainingMs / 1000)}s
              </span>
            </p>

            <p className="text-xs text-gray-500">
              This app uses a free backend that may sleep when idle.
            </p>
          </div>
        </div>
      )}

      <div
        className={
          waking ? "opacity-0" : "opacity-100 transition-opacity duration-500"
        }
      >
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route
              path="/checkout"
              element={
                <Protected>
                  <Checkout />
                </Protected>
              }
            />

            {/* Admin */}
            <Route
              path="/admin/products"
              element={
                <AdminGuard>
                  <AdminProducts />
                </AdminGuard>
              }
            />
            <Route path="/admin/orders" element={<AdminOrders />} />

            {/* Auth & profile */}
            <Route
              path="/profile"
              element={
                <Protected>
                  <Profile />
                </Protected>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Trust-bar pages */}
            <Route path="/deals/free-shipping" element={<FreeShippingPage />} />
            <Route path="/deals/easy-returns" element={<EasyReturnsPage />} />
            <Route path="/payments" element={<PaymentsPage />} />
            <Route path="/support" element={<SupportPage />} />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Layout>
      </div>
    </>
  );
}
