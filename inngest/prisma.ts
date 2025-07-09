import { PrismaClient } from "../lib/generated/prisma";

// Extend the global object to include a custom `prisma` property.
// This is needed because TypeScript by default doesn't know about `globalThis.prisma`.
declare global {
  var prisma: PrismaClient | undefined;
}

// Create a single instance of PrismaClient and reuse it across hot reloads in development.
// In production, we always create a new instance (because there's no hot reload).
export const db = globalThis.prisma ?? new PrismaClient();

// In development, assign the PrismaClient instance to `globalThis`
// so it persists across module reloads and prevents creating multiple clients.
if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = db;
}
