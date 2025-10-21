import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchProduct } from "../store/slices/productSlice";
import { addToCart } from "../store/slices/cartSlice";
export default function ProductDetails() {
  const { id } = useParams();
  const d = useDispatch();
  const API_BASE = (
    import.meta.env.VITE_API_URL || "http://localhost:5000"
  ).replace(/\/$/, "");

  function resolveImage(src) {
    if (!src) return "";
    if (/^https?:\/\//i.test(src)) return src;
    return `${API_BASE}${src.startsWith("/") ? "" : "/"}${src}`;
  }
  const p = useSelector((s) => s.products.current);
  useEffect(() => {
    d(fetchProduct(id));
  }, [d, id]);
  if (!p) return <div className="card">Loading...</div>;
  return (
    <div className="grid md:grid-cols-2 gap-8">
      <img
        src={resolveImage(p.image)}
        alt={p.title}
        className="w-full h-96 object-cover rounded-xl"
      />
      <div className="card">
        <h2 className="text-2xl font-bold">{p.title}</h2>
        <p className="text-gray-600 mt-2">{p.description}</p>
        <p className="mt-3 text-sm text-gray-500">
          {p.category} · ⭐ {p.rating}
        </p>
        <p className="text-3xl font-black mt-4">${p.price.toFixed(2)}</p>
        <button
          className="btn btn-primary w-full mt-6"
          onClick={() =>
            d(addToCart({ id: p.id, title: p.title, price: p.price }))
          }
        >
          Add to cart
        </button>
      </div>
    </div>
  );
}
