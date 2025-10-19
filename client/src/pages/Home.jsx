import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../store/slices/productSlice";
import ProductCard from "../components/ProductCard";
import { useSearchParams } from "react-router-dom";

import TrustBar from "../components/TrustBar";
import FilterChips from "../components/FilterChips";

export default function Home() {
  const dispatch = useDispatch();
  const list = useSelector((s) => s.products.list);

  const [searchParams] = useSearchParams();
  const q = (searchParams.get("q") || "").trim();
  const cat = searchParams.get("cat") || "all";
  const sort = searchParams.get("sort") || "popular";

  // Server-side search by q (keeps your current API behavior)
  useEffect(() => {
    dispatch(fetchProducts(q ? { q } : {}));
  }, [dispatch, q]);

  // Client-side category filter + sort
  const filtered = useMemo(() => {
    let arr = list;

    if (cat !== "all") {
      arr = arr.filter((p) => p.category === cat);
    }

    // Optional: re-apply q filter locally, in case API doesn't filter
    if (q) {
      const ql = q.toLowerCase();
      arr = arr.filter(
        (p) =>
          p.title?.toLowerCase().includes(ql) ||
          p.category?.toLowerCase().includes(ql)
      );
    }

    // Sorting
    const copy = arr.slice();
    if (sort === "price-asc") copy.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") copy.sort((a, b) => b.price - a.price);
    if (sort === "new")
      copy.sort((a, b) =>
        (b.created_at || "").localeCompare(a.created_at || "")
      );
    // "popular" keeps original order
    return copy;
  }, [list, q, cat, sort]);

  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* Hero */}
      <div className="rounded-2xl bg-gradient-to-r from-gray-900 to-gray-700 text-white p-8 mb-6">
        <h1 className="text-3xl font-black">Fall Tech Event</h1>
        <p className="mt-2 text-gray-300">
          Save up to 40% on select gear. Free returns.
        </p>
        {(q || cat !== "all") && (
          <p className="mt-3 text-sm text-gray-200">
            {q && (
              <>
                Showing results for: <strong>{q}</strong>
              </>
            )}{" "}
            {cat !== "all" && (
              <>
                {" "}
                · Category: <strong>{cat}</strong>
              </>
            )}
          </p>
        )}
      </div>

      {/* Trust bar + Filters */}
      <TrustBar />
      <FilterChips products={list} />

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="card p-6 text-center">
          <p className="font-medium">No products found.</p>
          <p className="text-sm text-gray-500 mt-1">
            Try clearing filters or searching a different term.
          </p>
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
      )}
    </div>
  );
}
