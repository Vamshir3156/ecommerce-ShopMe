import { useMemo, useRef, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function FilterChips({ products = [] }) {
  const [params, setParams] = useSearchParams();
  const cat = params.get("cat") || "all";
  const sort = params.get("sort") || "popular";

  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category).filter(Boolean));
    return ["all", ...Array.from(set)];
  }, [products]);

  const setCat = (c) => {
    const next = new URLSearchParams(params);
    c === "all" ? next.delete("cat") : next.set("cat", c);
    next.set("page", "1");
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

  const scrollerRef = useRef(null);
  const listRef = useRef(null);
  const [maxWidthPx, setMaxWidthPx] = useState(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const visibleCount = (() => {
    if (typeof window === "undefined") return 5;
    if (window.matchMedia("(max-width: 640px)").matches) return 3;
    if (window.matchMedia("(max-width: 1024px)").matches) return 4;
    return 8;
  })();

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;

    requestAnimationFrame(() => {
      const children = Array.from(el.children);
      const n = Math.min(visibleCount, children.length);
      let w = 0;
      for (let i = 0; i < n; i++) {
        const child = children[i];

        w += child.offsetWidth;

        if (i < n - 1) w += parseFloat(getComputedStyle(el).columnGap || 0);
      }
      setMaxWidthPx(w);
    });
  }, [categories, visibleCount]);

  useEffect(() => {
    const s = scrollerRef.current;
    if (!s) return;
    const onScroll = () => {
      setAtStart(s.scrollLeft <= 2);
      setAtEnd(s.scrollLeft + s.clientWidth >= s.scrollWidth - 2);
    };
    onScroll();
    s.addEventListener("scroll", onScroll, { passive: true });
    return () => s.removeEventListener("scroll", onScroll);
  }, [maxWidthPx]);

  const scrollByAmount = (dir) => {
    const s = scrollerRef.current;
    if (!s) return;
    const amount = Math.max(150, s.clientWidth * 0.6);
    s.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  return (
    <section className="mt-4 mb-2">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2 flex-1">
          <button
            onClick={() => scrollByAmount("left")}
            disabled={atStart}
            className={`p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-default`}
            aria-label="Scroll categories left"
          >
            <FaChevronLeft className="text-gray-600" />
          </button>

          <div
            ref={scrollerRef}
            className="overflow-x-auto no-scrollbar scroll-smooth"
            style={{ maxWidth: maxWidthPx ?? undefined }}
          >
            <div ref={listRef} className="flex gap-2 snap-x">
              {categories.map((c) => (
                <div key={c} className="snap-start">
                  <Chip active={cat === c} onClick={() => setCat(c)}>
                    {c[0].toUpperCase() + c.slice(1)}
                  </Chip>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => scrollByAmount("right")}
            disabled={atEnd}
            className={`p-2 rounded-full bg-gray-100 hover:bg-gray-200 mr-4 disabled:opacity-40 disabled:cursor-default`}
            aria-label="Scroll categories right"
          >
            <FaChevronRight className="text-gray-600" />
          </button>
        </div>

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
