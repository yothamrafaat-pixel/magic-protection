const { PrismaClient } = require("./node_modules/.prisma/client");
const prisma = new PrismaClient();
console.log("employee" in prisma, "expense" in prisma, Object.keys(prisma).slice(0,40));
prisma["$disconnect"]().catch(console.error);
