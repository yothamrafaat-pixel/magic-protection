export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const body = await req.json();

  if (!body.name) return Response.json({ error: "Name required" }, { status: 400 });

  const supplier = await prisma.supplier.update({
    where: { id },
    data: {
      name: body.name,
      contact: body.contact ?? null,
    },
  });

  return Response.json(supplier);
}

export async function DELETE(_req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  try {
    await prisma.supplier.delete({ where: { id } });
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: "فشل حذف المورد، قد يكون مرتبطًا ببيانات أخرى" }, { status: 400 });
  }
}
