import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

try {
  const branches = await prisma.branch.findMany({ orderBy: { createdAt: "desc" } });
  console.log("OK", branches.length);
} catch (error) {
  console.error(error);
} finally {
  await prisma.$disconnect();
}
