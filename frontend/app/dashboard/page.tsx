"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

interface Task {
  id: string;
  title: string;
  description?: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
}

const STATUS_LABEL: Record<Task["status"], string> = {
  TODO: "To do",
  IN_PROGRESS: "In progress",
  DONE: "Done",
};

const STATUS_COLOR: Record<Task["status"], string> = {
  TODO: "border-l-ink/30 dark:border-l-paper/30",
  IN_PROGRESS: "border-l-amber",
  DONE: "border-l-forest",
};

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState<string | null>(null);
  const [summarizing, setSummarizing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadTasks() {
    try {
      const data = await apiFetch("/api/tasks");
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load tasks");
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  async function addTask(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    await apiFetch("/api/tasks", { method: "POST", body: JSON.stringify({ title }) });
    setTitle("");
    loadTasks();
  }

  async function cycleStatus(task: Task) {
    const next =
      task.status === "TODO" ? "IN_PROGRESS" : task.status === "IN_PROGRESS" ? "DONE" : "TODO";
    await apiFetch(`/api/tasks/${task.id}`, { method: "PATCH", body: JSON.stringify({ status: next }) });
    loadTasks();
  }

  async function summarize() {
    setSummarizing(true);
    setSummary(null);
    try {
      const data = await apiFetch("/api/ai/summarize-tasks", { method: "POST" });
      setSummary(data.summary);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Summary failed");
    } finally {
      setSummarizing(false);
    }
  }

  const open = tasks.filter((t) => t.status !== "DONE").length;

  return (
    <main className="min-h-screen grid md:grid-cols-[220px_1fr]">
      <aside className="hidden md:flex flex-col justify-between border-r border-line dark:border-line-dark px-6 py-8">
        <div>
          <span className="font-mono text-sm text-ink/60 dark:text-paper/60">CORPOPS / 001</span>
          <h1 className="font-display text-2xl mt-4 mb-8">Ledger</h1>
          <p className="font-mono text-xs text-ink/50 dark:text-paper/50 uppercase tracking-wide mb-1">
            Open items
          </p>
          <p className="font-display text-4xl">{open}</p>
        </div>
        <button
          onClick={summarize}
          disabled={summarizing}
          className="w-full py-3 border border-ink dark:border-paper text-sm font-mono disabled:opacity-50"
        >
          {summarizing ? "Writing…" : "Write briefing"}
        </button>
      </aside>

      <section className="px-8 py-10 max-w-2xl">
        {error && <p className="text-rust text-sm mb-4 font-mono">{error}</p>}

        <form onSubmit={addTask} className="flex gap-3 mb-8 border-b border-line dark:border-line-dark pb-6">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add a task…"
            className="flex-1 px-0 py-2 bg-transparent border-0 border-b border-line dark:border-line-dark focus:border-forest outline-none placeholder:text-ink/40 dark:placeholder:text-paper/40"
          />
          <button className="px-5 py-2 bg-ink text-surface dark:bg-paper dark:text-night font-mono text-sm">
            Add
          </button>
        </form>

        <ul>
          {tasks.map((task) => (
            <li
              key={task.id}
              className={`flex items-center justify-between border-l-4 ${STATUS_COLOR[task.status]} border-b border-line dark:border-line-dark pl-4 pr-2 py-4`}
            >
              <span className="font-body">{task.title}</span>
              <button
                onClick={() => cycleStatus(task)}
                className="font-mono text-xs uppercase tracking-wide text-ink/60 dark:text-paper/60 hover:text-forest"
              >
                {STATUS_LABEL[task.status]}
              </button>
            </li>
          ))}
          {tasks.length === 0 && (
            <p className="text-ink/50 dark:text-paper/50 font-mono text-sm py-6">
              No entries yet — add one above.
            </p>
          )}
        </ul>

        <button
          onClick={summarize}
          disabled={summarizing}
          className="md:hidden mt-8 w-full py-3 border border-ink dark:border-paper text-sm font-mono disabled:opacity-50"
        >
          {summarizing ? "Writing…" : "Write briefing"}
        </button>

        {summary && (
          <div className="mt-8 p-5 bg-surface dark:bg-night-surface border-l-4 border-forest whitespace-pre-wrap font-body text-sm leading-relaxed text-ink dark:text-paper">
            {summary}
          </div>
        )}
      </section>
    </main>
  );
}