import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["error"],
  });

// مهم جدًا: يمنع إعادة الإنشاء في build
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}