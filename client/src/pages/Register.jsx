import { useDispatch } from "react-redux";
import { register } from "../store/slices/authSlice";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const d = useDispatch();
  const nav = useNavigate();
  return (
    <div className="max-w-sm mx-auto card mt-16 p-6 bg-white rounded-2xl shadow-md border border-gray-200">
      <h2 className="text-xl font-bold mb-4">Create account</h2>
      <input
        className="w-full border rounded px-3 py-2 mb-2"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
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
      <button
        className="btn btn-primary w-full"
        onClick={async () => {
          const r = await d(register({ name, email, password }));
          if (!r.error) nav("/login");
        }}
      >
        Sign up
      </button>
      <p className="text-sm mt-3">
        Already have an account?{" "}
        <Link to="/login" className="underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
