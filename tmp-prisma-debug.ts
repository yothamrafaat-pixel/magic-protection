import { prisma } from "./src/lib/prisma";

(async () => {
  try {
    const employees = await prisma.employee.findMany({ orderBy: { createdAt: "desc" } });
    console.log("OK", employees.length);
  } catch (err) {
    console.error("PRISMA ERROR", err);
  } finally {
    await prisma.$disconnect();
  }
})();
