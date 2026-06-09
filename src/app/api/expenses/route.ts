import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const data = await prisma.expense.findMany({
      orderBy: { createdAt: "desc" },
      include: { employee: true },
    });

    return Response.json(data);
  } catch (error) {
    console.error("Expenses GET error", {
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

    const { category, amount, description, employeeId } = body;

    if (!category || !amount) {
      return Response.json({ error: "Missing data" }, { status: 400 });
    }

    const expense = await prisma.expense.create({
      data: {
        category,
        amount: Number(amount),
        description,
        employeeId: employeeId || null,
      },
      include: { employee: true },
    });

    return Response.json(expense);
  } catch (err) {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}