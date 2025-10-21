import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../store/slices/cartSlice";
const API_BASE = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

// Turn relative "/images/..." into absolute "https://your-api.com/images/..."
function resolveImage(src) {
  if (!src) return "";
  if (/^https?:\/\//i.test(src)) return src; // already absolute
  return `${API_BASE}${src.startsWith("/") ? "" : "/"}${src}`;
}

export default function ProductCard({ p }) {
  const d = useDispatch();
  const [qty, setQty] = useState(1);

  const dec = (e) => {
    e.stopPropagation();
    setQty((q) => Math.max(1, q - 1));
  };
  const inc = (e) => {
    e.stopPropagation();
    setQty((q) => Math.min(99, q + 1));
  };
  const add = (e) => {
    e.stopPropagation();
    d(addToCart({ id: p.id, title: p.title, price: Number(p.price), qty }));
  };

  return (
    <div className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-gray-300">
      {/* Clickable area = image + text */}
      <Link to={`/product/${p.id}`} className="block">
        <div className="relative">
          <img
            src={resolveImage(p.image)}
            alt={p.title}
            className="w-full h-56 object-cover transform group-hover:scale-105 transition duration-500"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition duration-300" />
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-lg text-gray-800 group-hover:text-blue-600 transition">
            {p.title}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {p.category} · ⭐ {p.rating}
          </p>
        </div>
      </Link>

      {/* Controls outside the Link so clicks don’t navigate */}
      <div className="px-4 pb-4">
        <div className="flex items-center justify-between">
          <p className="text-xl font-extrabold text-gray-900">
            ${Number(p.price).toFixed(2)}
          </p>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Qty</span>
            <div className="flex items-center border rounded-lg">
              <button
                type="button"
                onClick={dec}
                className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-l-lg"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="w-8 text-center select-none">{qty}</span>
              <button
                type="button"
                onClick={inc}
                className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-r-lg"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={add}
          className="btn btn-primary w-full mt-3 bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-indigo-500 hover:to-blue-600 text-white font-semibold py-2 rounded-xl shadow-md hover:shadow-lg transition-all"
        >
          🛒 Add to cart
        </button>
      </div>
    </div>
  );
}
