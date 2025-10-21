import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";

export default function AdCarousel({
  items = [],
  interval = 1200,
  className = "",
}) {
  const [i, setI] = useState(0);
  const count = items.length || 1;
  const timer = useRef(null);
  const hovering = useRef(false);
  const trackRef = useRef(null);

  const safeItems = useMemo(
    () =>
      items.length
        ? items
        : [
            {
              id: "placeholder",
              image: "/images/hero.jpg",
              title: "Welcome to ShopX",
              subtitle: "Great deals, daily.",
              ctaText: "Shop now",
              href: "/",
              tint: "from-slate-900/80 to-transparent",
            },
          ],
    [items]
  );

  useEffect(() => {
    clearInterval(timer.current);
    timer.current = setInterval(() => {
      if (!hovering.current) setI((p) => (p + 1) % count);
    }, interval);
    return () => clearInterval(timer.current);
  }, [interval, count]);

  const go = (n) => setI((n + count) % count);
  const prev = () => go(i - 1);
  const next = () => go(i + 1);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    let startX = 0,
      dx = 0,
      touching = false;

    const onStart = (e) => {
      touching = true;
      startX = "touches" in e ? e.touches[0].clientX : e.clientX;
      dx = 0;
    };
    const onMove = (e) => {
      if (!touching) return;
      const x = "touches" in e ? e.touches[0].clientX : e.clientX;
      dx = x - startX;
    };
    const onEnd = () => {
      if (!touching) return;
      touching = false;
      if (Math.abs(dx) > 50) dx < 0 ? next() : prev();
    };

    el.addEventListener("pointerdown", onStart, { passive: true });
    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerup", onEnd, { passive: true });
    el.addEventListener("pointercancel", onEnd);
    return () => {
      el.removeEventListener("pointerdown", onStart);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onEnd);
      el.removeEventListener("pointercancel", onEnd);
    };
  }, [i, count]);

  return (
    <section
      className={`relative rounded-2xl overflow-hidden ${className}`}
      onMouseEnter={() => (hovering.current = true)}
      onMouseLeave={() => (hovering.current = false)}
    >
      <div
        ref={trackRef}
        className="flex transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ transform: `translateX(-${i * 100}%)` }}
      >
        {safeItems.map((ad) => (
          <div
            key={ad.id}
            className="min-w-full relative h-48 sm:h-56 md:h-64 lg:h-72"
          >
            <img
              src={ad.image}
              alt={ad.title}
              loading="eager"
              className="absolute inset-0 w-full h-full object-cover"
            />

            <div
              className={`absolute inset-0 bg-gradient-to-r ${
                ad.tint || "from-slate-900/80 to-transparent"
              }`}
            />

            <div className="relative h-full flex flex-col justify-center pl-6 sm:pl-8 md:pl-10 text-white">
              <h2 className="text-2xl md:text-3xl font-black drop-shadow-md">
                {ad.title}
              </h2>
              {ad.subtitle && (
                <p className="mt-1 text-white/90 max-w-xl">{ad.subtitle}</p>
              )}
              {ad.href && (
                <Link
                  to={ad.href}
                  className="mt-4 inline-flex items-center gap-2 rounded-xl px-4 py-2 font-semibold bg-white text-gray-900 hover:bg-gray-100 shadow"
                >
                  {ad.ctaText || "Learn more"} <span>→</span>
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      {count > 1 && (
        <>
          <button
            aria-label="Previous"
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 grid place-items-center w-9 h-9 rounded-full bg-white/80 hover:bg-white shadow"
          >
            ‹
          </button>
          <button
            aria-label="Next"
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 grid place-items-center w-9 h-9 rounded-full bg-white/80 hover:bg-white shadow"
          >
            ›
          </button>
        </>
      )}

      {count > 1 && (
        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
          {safeItems.map((_, idx) => (
            <button
              key={idx}
              aria-label={`Go to slide ${idx + 1}`}
              onClick={() => go(idx)}
              className={`h-1.5 rounded-full transition-all ${
                i === idx ? "w-6 bg-white" : "w-2 bg-white/60"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
