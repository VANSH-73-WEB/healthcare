import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { connectWallet } from "../utils/web3.js";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "patient",
    walletAddress: "",
    specialization: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleConnectWallet() {
    try {
      const address = await connectWallet();
      setForm((f) => ({ ...f, walletAddress: address }));
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await register(form);
      navigate(user.role === "patient" ? "/patient" : "/doctor");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-radial-fade px-6 py-16">
      <div className="w-full max-w-md card-surface p-8 sm:p-10">
        <h2 className="font-display text-2xl font-bold text-ink mb-1">
          Create your account
        </h2>
        <p className="text-sm text-body mb-6">
          Join MedChain as a patient, doctor, or hospital.
        </p>

        {error && (
          <p className="text-alert-500 text-sm mb-4 bg-alert-500/5 border border-alert-500/20 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Full name"
            required
            className="w-full border border-ink/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent transition"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
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

          <select
            className="w-full border border-ink/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent transition"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
            <option value="hospital">Hospital</option>
          </select>

          {form.role !== "patient" && (
            <input
              type="text"
              placeholder="Specialization (e.g. Cardiology)"
              className="w-full border border-ink/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent transition"
              value={form.specialization}
              onChange={(e) => setForm({ ...form, specialization: e.target.value })}
            />
          )}

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Wallet address (0x...)"
              required
              className="flex-1 border border-ink/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent transition"
              value={form.walletAddress}
              onChange={(e) => setForm({ ...form, walletAddress: e.target.value })}
            />
            <button
              type="button"
              onClick={handleConnectWallet}
              className="whitespace-nowrap bg-teal-500 text-white px-4 rounded-xl text-sm font-semibold hover:bg-teal-600 transition"
            >
              Connect MetaMask
            </button>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="text-sm text-body mt-6 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-brand-600 font-semibold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
