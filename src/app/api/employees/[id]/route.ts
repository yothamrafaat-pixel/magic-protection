export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const body = await req.json();

  const employee = await prisma.employee.update({
    where: { id },
    data: {
      name: body.name,
      position: body.position || null,
      salary: Number(body.salary),
    },
  });

  return Response.json(employee);
}

export async function DELETE(_req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  await prisma.employee.delete({ where: { id } });

  return Response.json({ success: true });
}
