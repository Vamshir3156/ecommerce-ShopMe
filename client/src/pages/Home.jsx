import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../store/slices/productSlice";
import ProductCard from "../components/ProductCard";
import { useSearchParams } from "react-router-dom";

import TrustBar from "../components/TrustBar";
import FilterChips from "../components/FilterChips";
import AdCarousel from "../components/AdCarousel"; // <- add

export default function Home() {
  const dispatch = useDispatch();
  const list = useSelector((s) => s.products.list);

  const [searchParams] = useSearchParams();
  const q = (searchParams.get("q") || "").trim();
  const cat = searchParams.get("cat") || "all";
  const sort = searchParams.get("sort") || "popular";

  // Fetch by search term (server-side)
  useEffect(() => {
    dispatch(fetchProducts(q ? { q } : {}));
  }, [dispatch, q]);

  // Client-side filter + sort
  const filtered = useMemo(() => {
    let arr = list;
    if (cat !== "all") arr = arr.filter((p) => p.category === cat);

    if (q) {
      const ql = q.toLowerCase();
      arr = arr.filter(
        (p) =>
          p.title?.toLowerCase().includes(ql) ||
          p.category?.toLowerCase().includes(ql)
      );
    }

    const copy = arr.slice();
    if (sort === "price-asc") copy.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") copy.sort((a, b) => b.price - a.price);
    if (sort === "new")
      copy.sort((a, b) =>
        (b.created_at || "").localeCompare(a.created_at || "")
      );
    return copy;
  }, [list, q, cat, sort]);

  // Ads for the carousel (use your own images/links)
  const ads = [
    {
      id: "ad1",
      image:
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1600&auto=format&fit=crop",
      title: "Pro Laptops Week",
      subtitle: "Save up to 25% on creator laptops.",
      ctaText: "Shop laptops",
      href: "/?cat=Computers",
      tint: "from-slate-900/80 to-transparent",
    },
    {
      id: "ad2",
      image:
        "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=1600&auto=format&fit=crop",
      title: "Audio Mega Sale",
      subtitle: "Headphones, speakers & more.",
      ctaText: "Explore audio",
      href: "/?cat=Audio",
      tint: "from-black/75 to-transparent",
    },
    {
      id: "ad3",
      image:
        "https://plus.unsplash.com/premium_photo-1712764121254-d9867c694b81?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8d2VhcmFibGUlMjB0ZWNofGVufDB8fDB8fHww&fm=jpg&q=60&w=3000",
      title: "Wearables from $49",
      subtitle: "Track more. Charge less.",
      ctaText: "See wearables",
      href: "/?cat=Wearables",
      tint: "from-indigo-900/70 to-transparent",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* Ad carousel replaces hero */}
      <AdCarousel items={ads} className="mb-6" />

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
