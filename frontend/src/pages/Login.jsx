import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      navigate(user.role === "patient" ? "/patient" : "/doctor");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-radial-fade px-6 py-16">
      <div className="w-full max-w-md card-surface p-8 sm:p-10">
        <h2 className="font-display text-2xl font-bold text-ink mb-1">
          Welcome back
        </h2>
        <p className="text-sm text-body mb-6">
          Log in to manage your appointments and records.
        </p>

        {error && (
          <p className="text-alert-500 text-sm mb-4 bg-alert-500/5 border border-alert-500/20 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            required
            className="w-full border border-ink/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent transition"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            required
            className="w-full border border-ink/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent transition"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-sm text-body mt-6 text-center">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="text-brand-600 font-semibold">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
