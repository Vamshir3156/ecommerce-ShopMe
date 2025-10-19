import { Link, NavLink, useNavigate, useSearchParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/slices/authSlice";

export default function Navbar() {
  const user = useSelector((s) => s.auth.user);
  const cartCount = useSelector((s) =>
    s.cart.items.reduce((a, c) => a + c.qty, 0)
  );
  const dispatch = useDispatch();
  const nav = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get("q") || "";

  const onSubmit = (e) => {
    e.preventDefault();
    // always send users to Home with ?q=...
    setSearchParams(q ? { q } : {});
    nav(q ? `/?q=${encodeURIComponent(q)}` : "/");
  };

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 px-4 py-3">
        <Link to="/" className="font-black text-xl tracking-tight">
          ShopX
        </Link>

        {/* Search */}
        <form onSubmit={onSubmit} className="flex-1 max-w-xl">
          <input
            className="w-full border rounded-lg px-3 py-2 text-sm"
            placeholder="Search products…"
            value={q}
            onChange={(e) =>
              setSearchParams(e.target.value ? { q: e.target.value } : {})
            }
          />
        </form>

        <nav className="flex items-center gap-4 text-sm">
          <NavLink to="/" className="hover:underline">
            Home
          </NavLink>

          {/* Hide cart for admins (optional) */}
          {user?.role !== "admin" && (
            <NavLink to="/cart" className="hover:underline">
              Cart ({cartCount})
            </NavLink>
          )}

          {user?.role === "admin" && (
            <>
              <NavLink to="/admin/products" className="hover:underline">
                Products
              </NavLink>
              <NavLink to="/admin/orders" className="hover:underline">
                Orders
              </NavLink>
            </>
          )}

          {user ? (
            <>
              <NavLink to="/profile" className="hover:underline">
                Profile
              </NavLink>
              <button
                className="btn"
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
              <NavLink to="/login" className="btn">
                Log in
              </NavLink>
              <NavLink to="/register" className="btn btn-primary">
                Sign up
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
