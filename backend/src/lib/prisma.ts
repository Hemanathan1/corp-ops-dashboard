import { PrismaClient } from "@prisma/client";

// Reuse a single Prisma instance across hot reloads in dev
export const prisma = new PrismaClient();
