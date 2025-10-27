import { useDispatch, useSelector } from "react-redux";
import { login } from "../store/slices/authSlice";
import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { FaUserAlt, FaUserShield } from "react-icons/fa";

export default function Login() {
  const [email, setEmail] = useState("demo@shop.dev");
  const [password, setPassword] = useState("Demo@123");
  const [role, setRole] = useState("user");
  const error = useSelector((s) => s.auth.error);
  const d = useDispatch();
  const nav = useNavigate();
  const loc = useLocation();
  const next = loc.state?.from?.pathname || "/";

  const handleQuickLogin = (type) => {
    setRole(type);
    if (type === "admin") {
      setEmail("admin@shop.dev");
      setPassword("Admin@123");
    } else {
      setEmail("demo@shop.dev");
      setPassword("Demo@123");
    }
  };

  return (
    <div className="max-w-sm mx-auto card mt-16 p-6 bg-white rounded-2xl shadow-md border border-gray-200">
      <h2 className="text-xl font-bold mb-4 text-center text-gray-800">
        Welcome back
      </h2>

      <div className="flex justify-center gap-3 mb-4">
        <button
          onClick={() => handleQuickLogin("user")}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-semibold transition-all ${
            role === "user"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          <FaUserAlt size={14} />
          Login as User
        </button>

        <button
          onClick={() => handleQuickLogin("admin")}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-semibold transition-all ${
            role === "admin"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          <FaUserShield size={15} />
          Login as Admin
        </button>
      </div>

      <input
        className="w-full border rounded px-3 py-2 mb-2"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        className="w-full border rounded px-3 py-2 mb-2"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {error && <p className="text-sm text-red-600 mb-2">{error}</p>}

      <button
        className="btn btn-primary w-full"
        onClick={async () => {
          const r = await d(login({ email, password }));
          if (r.type.endsWith("fulfilled")) nav(next);
        }}
      >
        Log in
      </button>

      <p className="text-sm mt-3 text-center text-gray-600">
        No account?{" "}
        <Link to="/register" className="underline text-blue-600 font-medium">
          Create one
        </Link>
      </p>
    </div>
  );
}
