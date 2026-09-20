import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { requireAuth, AuthedRequest } from "../middleware/auth";

const router = Router();
router.use(requireAuth);

// List the current user's tasks
router.get("/", async (req: AuthedRequest, res) => {
  const tasks = await prisma.task.findMany({
    where: { ownerId: req.userId },
    orderBy: { createdAt: "desc" },
  });
  res.json(tasks);
});

const createSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
});

router.post("/", async (req: AuthedRequest, res) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  const task = await prisma.task.create({
    data: { ...parsed.data, ownerId: req.userId as string },
  });
  res.status(201).json(task);
});

const updateSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  status: z.enum(["TODO", "IN_PROGRESS", "DONE"]).optional(),
});

router.patch("/:id", async (req: AuthedRequest, res) => {
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const existing = await prisma.task.findUnique({ where: { id: req.params.id } });
  if (!existing || existing.ownerId !== req.userId) {
    return res.status(404).json({ error: "Task not found" });
  }

  const task = await prisma.task.update({
    where: { id: req.params.id },
    data: parsed.data,
  });
  res.json(task);
});

router.delete("/:id", async (req: AuthedRequest, res) => {
  const existing = await prisma.task.findUnique({ where: { id: req.params.id } });
  if (!existing || existing.ownerId !== req.userId) {
    return res.status(404).json({ error: "Task not found" });
  }
  await prisma.task.delete({ where: { id: req.params.id } });
  res.status(204).send();
});

export default router;
