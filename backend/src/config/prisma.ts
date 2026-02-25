import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { env } from "./env";

declare global {
  // eslint-disable-next-line no-var
  var __prismaClient__: PrismaClient | undefined;
}

export const prisma =
  global.__prismaClient__ ??
  new PrismaClient({
    adapter: new PrismaMariaDb(env.DATABASE_URL),
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  global.__prismaClient__ = prisma;
}
