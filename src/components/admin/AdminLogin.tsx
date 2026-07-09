"use client";

import { useState } from "react";
import { Lock } from "lucide-react";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (res.ok) window.location.reload();
    else setError("Wrong password. Try again.");
  }

  return (
    <div className="grid min-h-[70vh] place-items-center px-4">
      <form onSubmit={submit} className="w-full max-w-sm rounded-2xl border border-line bg-white p-8 shadow-[var(--shadow-soft)]">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-brand-soft text-brand">
          <Lock size={22} />
        </div>
        <h1 className="mt-4 text-center text-xl font-extrabold text-ink font-display">Admin Login</h1>
        <p className="mt-1 text-center text-sm text-ink-soft">Enter your admin password to manage products.</p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          autoFocus
          className="mt-5 h-12 w-full rounded-xl border border-line bg-surface px-4 text-sm outline-none focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/15"
        />
        {error && <p className="mt-2 text-sm text-brand">{error}</p>}
        <button
          disabled={loading}
          className="mt-4 h-12 w-full rounded-xl bg-brand text-sm font-semibold text-white transition hover:bg-brand-dark disabled:opacity-60"
        >
          {loading ? "Checking…" : "Log in"}
        </button>
        <p className="mt-4 text-center text-xs text-ink-soft">Default password: <code>casebazar123</code> — change it in <code>.env.local</code></p>
      </form>
    </div>
  );
}
