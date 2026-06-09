export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const data = await prisma.employee.findMany({
      orderBy: { createdAt: "desc" },
    });

    return Response.json(data);
  } catch (error) {
    console.error("Employees GET error", {
      error,
      databaseUrl: process.env.DATABASE_URL,
      prismaClient: typeof prisma,
    });
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, position, salary } = body;

    if (!name || salary === undefined || salary === null) {
      return Response.json({ error: "Missing employee data" }, { status: 400 });
    }

    const employee = await prisma.employee.create({
      data: {
        name,
        position: position || null,
        salary: Number(salary),
      },
    });

    return Response.json(employee);
  } catch (err) {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
