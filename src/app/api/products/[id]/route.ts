import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const body = await req.json();

  const product = await prisma.product.update({
    where: { id },
    data: {
      name: body.name,
      costPrice: Number(body.costPrice),
      sellingPrice: body.sellingPrice ? Number(body.sellingPrice) : null,
    },
  });

  return Response.json(product);
}

export async function DELETE(_req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  try {
    await prisma.product.delete({ where: { id } });
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: "فشل حذف المنتج، قد يكون مرتبطًا ببيانات أخرى" }, { status: 400 });
  }
}
