import { Link, NavLink, useNavigate, useSearchParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useMemo, useState } from "react";
import { logout } from "../store/slices/authSlice";

const PillLink = ({ to, children, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      [
        "px-3 py-1.5 rounded-xl text-sm transition-colors",
        isActive ? "bg-gray-900 text-white" : "text-gray-700 hover:bg-gray-100",
      ].join(" ")
    }
  >
    {children}
  </NavLink>
);

export default function Navbar() {
  const user = useSelector((s) => s.auth.user);
  const cartCount = useSelector((s) =>
    s.cart.items.reduce((a, c) => a + c.qty, 0)
  );
  const hasItems = cartCount > 0;

  const dispatch = useDispatch();
  const nav = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();
  const [open, setOpen] = useState(false);
  const q = searchParams.get("q") || "";

  const onSubmit = (e) => {
    e.preventDefault();
    setSearchParams(q ? { q } : {});
    nav(q ? `/?q=${encodeURIComponent(q)}` : "/");
    setOpen(false);
  };
  const clearSearch = () => setSearchParams({});

  const AdminLinks = useMemo(
    () =>
      user?.role === "admin" && (
        <>
          <PillLink to="/admin/products" onClick={() => setOpen(false)}>
            Products
          </PillLink>
          <PillLink to="/admin/orders" onClick={() => setOpen(false)}>
            Orders
          </PillLink>
        </>
      ),
    [user?.role]
  );

  return (
    <header className="sticky top-0 z-40">
      <div className="h-[2px] bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-600 opacity-60" />

      <div className="backdrop-blur-xl bg-white/80 supports-[backdrop-filter]:bg-white/60 border-b border-white/70 shadow-[0_6px_30px_-12px_rgba(31,41,55,0.18)]">
        <div className="max-w-7xl mx-auto px-3 sm:px-4">
          <div className="h-16 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                className="sm:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl border border-gray-200 bg-white/70 hover:bg-white transition"
                aria-label="Toggle menu"
                onClick={() => setOpen((v) => !v)}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M4 7h16M4 12h16M4 17h16"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </button>

              <Link
                to="/"
                className="font-black text-lg sm:text-xl tracking-tight text-gray-900"
                onClick={() => setOpen(false)}
              >
                ShopX
              </Link>
            </div>

            <form
              onSubmit={onSubmit}
              className="hidden sm:block flex-1 max-w-xl"
            >
              <div className="relative">
                <input
                  className="w-full border border-gray-200 focus:border-blue-400 rounded-2xl px-4 py-2.5 text-sm bg-white/85 outline-none transition shadow-sm focus:shadow-md"
                  placeholder="Search products…"
                  value={q}
                  onChange={(e) =>
                    setSearchParams(e.target.value ? { q: e.target.value } : {})
                  }
                />
                {q && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center"
                    aria-label="Clear search"
                  >
                    ✕
                  </button>
                )}
              </div>
            </form>

            <nav className="hidden sm:flex items-center gap-2">
              <PillLink to="/">Home</PillLink>

              {user?.role !== "admin" && (
                <NavLink
                  to="/cart"
                  className={({ isActive }) =>
                    [
                      "px-3 py-1.5 rounded-xl text-sm transition-colors inline-flex items-center gap-1.5",
                      isActive
                        ? "bg-gray-900 text-white"
                        : "text-gray-700 hover:bg-gray-100",
                    ].join(" ")
                  }
                >
                  Cart
                  <span
                    className={[
                      "ml-1 inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 rounded-full text-[11px] font-semibold",
                      hasItems
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700",
                    ].join(" ")}
                    aria-label={`${cartCount} items in cart`}
                  >
                    {cartCount}
                  </span>
                </NavLink>
              )}

              {AdminLinks}

              {user ? (
                <>
                  <PillLink to="/profile">Profile</PillLink>
                  <button
                    className="ml-1 inline-flex items-center justify-center px-3 py-2 rounded-xl border border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50 text-gray-800 text-sm font-medium transition"
                    onClick={async () => {
                      await dispatch(logout());
                      nav("/");
                    }}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center px-4 py-2 rounded-xl border border-gray-200 bg-white hover:border-gray-300 text-gray-800 text-sm font-medium transition"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-white text-sm font-semibold bg-gray-900 hover:bg-black transition shadow-sm"
                  >
                    Sign up
                  </Link>
                </>
              )}
            </nav>
          </div>

          {open && (
            <div className="sm:hidden pb-4 space-y-3">
              <form onSubmit={onSubmit}>
                <div className="relative">
                  <input
                    className="w-full border border-gray-200 focus:border-blue-400 rounded-2xl px-4 py-2.5 text-sm bg-white/90 outline-none transition shadow-sm focus:shadow-md"
                    placeholder="Search products…"
                    value={q}
                    onChange={(e) =>
                      setSearchParams(
                        e.target.value ? { q: e.target.value } : {}
                      )
                    }
                  />
                  {q && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center"
                      aria-label="Clear search"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </form>

              <div className="grid gap-2">
                <PillLink to="/" onClick={() => setOpen(false)}>
                  Home
                </PillLink>

                {user?.role !== "admin" && (
                  <NavLink
                    to="/cart"
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      [
                        "px-3 py-1.5 rounded-xl text-sm transition-colors inline-flex items-center gap-1.5",
                        isActive
                          ? "bg-gray-900 text-white"
                          : "text-gray-700 hover:bg-gray-100",
                      ].join(" ")
                    }
                  >
                    Cart
                    <span
                      className={[
                        "ml-1 inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 rounded-full text-[11px] font-semibold",
                        hasItems
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-700",
                      ].join(" ")}
                    >
                      {cartCount}
                    </span>
                  </NavLink>
                )}

                {AdminLinks && (
                  <div onClick={() => setOpen(false)} className="contents">
                    {AdminLinks}
                  </div>
                )}

                {user ? (
                  <>
                    <PillLink to="/profile" onClick={() => setOpen(false)}>
                      Profile
                    </PillLink>
                    <button
                      className="inline-flex items-center justify-center px-4 py-2 rounded-xl border border-gray-200 bg-white hover:border-gray-300 text-gray-800 text-sm font-medium transition"
                      onClick={async () => {
                        await dispatch(logout());
                        setOpen(false);
                        nav("/");
                      }}
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setOpen(false)}
                      className="inline-flex items-center justify-center px-4 py-2 rounded-xl border border-gray-200 bg-white hover:border-gray-300 text-gray-800 text-sm font-medium transition"
                    >
                      Log in
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setOpen(false)}
                      className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-white text-sm font-semibold bg-gray-900 hover:bg-black transition shadow-sm"
                    >
                      Sign up
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
