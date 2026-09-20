import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

export default function Home() {
  return (
    <main className="min-h-screen">
      <header className="border-b border-line dark:border-line-dark px-8 py-5 flex items-center justify-between">
        <span className="font-mono text-sm tracking-wide text-ink/70 dark:text-paper/70">
          CORPOPS / 001
        </span>
        <nav className="flex items-center gap-6 font-mono text-sm">
          <Link href="/login" className="hover:text-forest">
            Log in
          </Link>
          <Link href="/register" className="hover:text-forest">
            Register
          </Link>
          <ThemeToggle />
        </nav>
      </header>

      <section className="max-w-3xl mx-auto px-8 py-24">
        <p className="font-mono text-sm text-forest mb-4">Internal operations, on one page</p>
        <h1 className="font-display text-6xl leading-[1.05] mb-8">
          Track the work.
          <br />
          Skip the status meeting.
        </h1>
        <p className="text-lg text-ink/70 dark:text-paper/70 max-w-lg mb-10 leading-relaxed">
          CorpOps keeps every task in one ledger, and writes the update for
          you — a short, prioritized briefing generated from what's actually
          open right now.
        </p>
        <div className="flex gap-4 items-center">
          <Link
            href="/register"
            className="px-6 py-3 bg-forest text-surface font-body font-medium"
          >
            Start tracking
          </Link>
          <Link
            href="/login"
            className="px-6 py-3 border border-ink/30 dark:border-paper/30 font-body"
          >
            I have an account
          </Link>
        </div>
      </section>

      <section className="border-t border-line dark:border-line-dark px-8 py-10">
        <div className="max-w-3xl mx-auto grid grid-cols-3 gap-8 font-mono text-sm text-ink/60 dark:text-paper/60">
          <div>
            <div className="text-ink dark:text-paper text-2xl font-display mb-1">01</div>
            Log in and add what's on your plate
          </div>
          <div>
            <div className="text-ink dark:text-paper text-2xl font-display mb-1">02</div>
            Move it through to-do, in progress, done
          </div>
          <div>
            <div className="text-ink dark:text-paper text-2xl font-display mb-1">03</div>
            Get a written briefing on demand
          </div>
        </div>
      </section>
    </main>
  );
}