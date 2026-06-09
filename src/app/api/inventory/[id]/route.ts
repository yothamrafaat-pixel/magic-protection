import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const body = await req.json();

  if (body.quantity === undefined || Number(body.quantity) < 0) {
    return Response.json({ error: "الكمية غير صحيحة" }, { status: 400 });
  }

  const inventory = await prisma.inventory.update({
    where: { id },
    data: {
      quantity: Number(body.quantity),
    },
  });

  return Response.json(inventory);
}

export async function DELETE(_req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  try {
    await prisma.inventory.delete({ where: { id } });
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: "فشل حذف المخزون" }, { status: 400 });
  }
}
