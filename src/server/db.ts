import { PrismaClient } from "@prisma/client"
import { env } from "~/env"

export const db = new PrismaClient({
  log:
    env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
})

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? db;

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;