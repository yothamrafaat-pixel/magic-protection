import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
try {
  const result = await prisma.$queryRaw`SELECT sql FROM sqlite_master WHERE name='Branch';`;
  console.log(result);
} catch (error) {
  console.error(error);
} finally {
  await prisma.$disconnect();
}
