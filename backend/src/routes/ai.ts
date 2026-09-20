import { Router } from "express";
import { prisma } from "../lib/prisma";
import { requireAuth, AuthedRequest } from "../middleware/auth";

const router = Router();
router.use(requireAuth);

// Summarizes the current user's open tasks using Claude.
// This is the "AI-powered feature" layer of the stack: a real integration
// with the Anthropic API, not a canned response.
router.post("/summarize-tasks", async (req: AuthedRequest, res) => {
  const tasks = await prisma.task.findMany({
    where: { ownerId: req.userId, status: { not: "DONE" } },
    orderBy: { createdAt: "desc" },
  });

  if (tasks.length === 0) {
    return res.json({ summary: "No open tasks to summarize." });
  }

  const taskList = tasks
    .map((t) => `- [${t.status}] ${t.title}${t.description ? `: ${t.description}` : ""}`)
    .join("\n");

  try {
    const geminiKey = process.env.GEMINI_API_KEY as string;
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${geminiKey}`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Summarize these open work tasks into a short, prioritized briefing a manager could read in 10 seconds:\n\n${taskList}`,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = (await response.json()) as any;

    if (data.error) {
      console.error("Gemini API error:", data.error);
      return res.status(502).json({ error: data.error.message || "AI summarization service unavailable" });
    }

    const summary =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "Could not generate summary.";

    res.json({ summary });
  } catch (err) {
    console.error("AI summarize error:", err);
    res.status(502).json({ error: "AI summarization service unavailable" });
  }
});

export default router;
