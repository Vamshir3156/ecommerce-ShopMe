import { Link, NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/slices/authSlice";
export default function Navbar() {
  const user = useSelector((s) => s.auth.user);
  const cartCount = useSelector((s) =>
    s.cart.items.reduce((a, c) => a + c.qty, 0)
  );
  const dispatch = useDispatch();
  const nav = useNavigate();
  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/" className="font-black text-xl tracking-tight">
          ShopX
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <NavLink to="/" className="hover:underline">
            Home
          </NavLink>
          <NavLink to="/cart" className="hover:underline">
            Cart ({cartCount})
          </NavLink>

          {user?.role === "admin" && (
            <NavLink to="/admin/products" className="hover:underline">
              Products
            </NavLink>
          )}

          {user ? (
            <>
              <NavLink to="/profile" className="hover:underline">
                {user.name}
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
