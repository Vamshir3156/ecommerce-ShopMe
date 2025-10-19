import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../store/slices/productSlice";
import ProductCard from "../components/ProductCard";
import { useSearchParams } from "react-router-dom";

export default function Home() {
  const dispatch = useDispatch();
  const list = useSelector((s) => s.products.list);
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q") || "";

  useEffect(() => {
    dispatch(fetchProducts(q ? { q } : {}));
  }, [dispatch, q]);

  return (
    <div>
      <div className="rounded-2xl bg-gradient-to-r from-gray-900 to-gray-700 text-white p-8 mb-8">
        <h1 className="text-3xl font-black">Fall Tech Event</h1>
        <p className="mt-2 text-gray-300">
          Save up to 40% on select gear. Free returns.
        </p>
        {q && (
          <p className="mt-3 text-sm text-gray-200">
            Showing results for: <strong>{q}</strong>
          </p>
        )}
      </div>

      {list.length === 0 ? (
        <div className="card">No products found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {list.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
      )}
    </div>
  );
}
