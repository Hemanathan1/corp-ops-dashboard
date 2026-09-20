"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const data = await apiFetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      localStorage.setItem("token", data.token);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen grid md:grid-cols-2">
      <div className="hidden md:flex flex-col justify-between bg-forest text-surface px-12 py-10">
        <span className="font-mono text-sm tracking-wide">CORPOPS / 001</span>
        <h1 className="font-display text-5xl leading-tight">
          Welcome back.
          <br />
          Your ledger is where you left it.
        </h1>
        <p className="font-mono text-sm text-surface/70">
          Every task, one place, no status meeting required.
        </p>
      </div>

      <div className="flex items-center justify-center px-8 py-16 bg-paper dark:bg-night">
        <form onSubmit={handleSubmit} className="w-full max-w-sm">
          <h2 className="font-display text-3xl mb-8 text-ink dark:text-paper">Log in</h2>
          {error && <p className="text-rust text-sm mb-4 font-mono">{error}</p>}

          <label className="block font-mono text-sm text-ink/60 dark:text-paper/60 mb-1">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-5 px-0 py-2 bg-transparent border-0 border-b border-line dark:border-line-dark focus:border-forest outline-none text-ink dark:text-paper"
            required
          />

          <label className="block font-mono text-sm text-ink/60 dark:text-paper/60 mb-1">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mb-8 px-0 py-2 bg-transparent border-0 border-b border-line dark:border-line-dark focus:border-forest outline-none text-ink dark:text-paper"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-ink text-surface dark:bg-paper dark:text-night font-body font-medium disabled:opacity-50"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>

          <p className="text-sm text-center mt-6 text-ink/60 dark:text-paper/60 font-mono">
            No account yet?{" "}
            <a href="/register" className="text-forest underline">
              Register
            </a>
          </p>
        </form>
      </div>
    </main>
  );
}