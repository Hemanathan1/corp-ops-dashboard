"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const data = await apiFetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      });
      localStorage.setItem("token", data.token);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen grid md:grid-cols-2">
      <div className="hidden md:flex flex-col justify-between bg-forest text-surface px-12 py-10">
        <span className="font-mono text-sm tracking-wide">CORPOPS / 001</span>
        <h1 className="font-display text-5xl leading-tight">
          Open your
          <br />
          first ledger.
        </h1>
        <p className="font-mono text-sm text-surface/70">
          Takes under a minute. No credit card, no setup wizard.
        </p>
      </div>

      <div className="flex items-center justify-center px-8 py-16">
        <form onSubmit={handleSubmit} className="w-full max-w-sm">
          <h2 className="font-display text-3xl mb-8">Create an account</h2>
          {error && <p className="text-rust text-sm mb-4 font-mono">{error}</p>}

          <label className="block font-mono text-sm text-ink/60 mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full mb-5 px-0 py-2 bg-transparent border-0 border-b border-line focus:border-forest outline-none"
            required
          />

          <label className="block font-mono text-sm text-ink/60 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-5 px-0 py-2 bg-transparent border-0 border-b border-line focus:border-forest outline-none"
            required
          />

          <label className="block font-mono text-sm text-ink/60 mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mb-2 px-0 py-2 bg-transparent border-0 border-b border-line focus:border-forest outline-none"
            minLength={8}
            required
          />
          <p className="text-xs font-mono text-ink/40 mb-8">At least 8 characters.</p>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-ink text-surface font-body font-medium disabled:opacity-50"
          >
            {loading ? "Creating account…" : "Create account"}
          </button>

          <p className="text-sm text-center mt-6 text-ink/60 font-mono">
            Already have an account?{" "}
            <a href="/login" className="text-forest underline">
              Log in
            </a>
          </p>
        </form>
      </div>
    </main>
  );
}
