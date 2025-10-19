import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

export default function FilterChips({ products = [] }) {
  const [params, setParams] = useSearchParams();
  const cat = params.get("cat") || "all";
  const sort = params.get("sort") || "popular";

  // Build unique categories from products
  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category).filter(Boolean));
    return ["all", ...Array.from(set)];
  }, [products]);

  const setCat = (c) => {
    const next = new URLSearchParams(params);
    if (c === "all") next.delete("cat");
    else next.set("cat", c);
    next.set("page", "1"); // if you add pagination later
    setParams(next);
  };

  const setSort = (s) => {
    const next = new URLSearchParams(params);
    next.set("sort", s);
    setParams(next);
  };

  const Chip = ({ active, children, onClick }) => (
    <button
      onClick={onClick}
      className={[
        "px-3 py-1.5 rounded-full border text-sm transition whitespace-nowrap",
        active
          ? "bg-gray-900 text-white border-gray-900"
          : "bg-white hover:bg-gray-50 border-gray-300 text-gray-700",
      ].join(" ")}
    >
      {children}
    </button>
  );

  return (
    <section className="mt-4 mb-2">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {/* Category chips */}
        <div className="flex gap-2 overflow-x-auto snap-x no-scrollbar">
          {categories.map((c) => (
            <div key={c} className="snap-start">
              <Chip active={cat === c} onClick={() => setCat(c)}>
                {c[0].toUpperCase() + c.slice(1)}
              </Chip>
            </div>
          ))}
        </div>

        {/* Sort controls */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Sort</span>
          <Chip active={sort === "popular"} onClick={() => setSort("popular")}>
            Popular
          </Chip>
          <Chip
            active={sort === "price-asc"}
            onClick={() => setSort("price-asc")}
          >
            Price ↑
          </Chip>
          <Chip
            active={sort === "price-desc"}
            onClick={() => setSort("price-desc")}
          >
            Price ↓
          </Chip>
          <Chip active={sort === "new"} onClick={() => setSort("new")}>
            New
          </Chip>
        </div>
      </div>
    </section>
  );
}
