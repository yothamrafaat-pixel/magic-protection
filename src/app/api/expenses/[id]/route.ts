export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const body = await req.json();

  const expense = await prisma.expense.update({
    where: { id },
    data: {
      category: body.category,
      amount: Number(body.amount),
      description: body.description || null,
      employeeId: body.employeeId || null,
    },
    include: { employee: true },
  });

  return Response.json(expense);
}

export async function DELETE(_req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  await prisma.expense.delete({ where: { id } });

  return Response.json({ success: true });
}
