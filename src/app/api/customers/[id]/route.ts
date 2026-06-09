import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const body = await req.json();

  const customer = await prisma.customer.update({
    where: { id },
    data: {
      name: body.name,
      phone: body.phone || null,
      carType: body.carType || null,
      model: body.model || null,
      chassis: body.chassis || null,
    },
  });

  return Response.json(customer);
}

export async function DELETE(_req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  try {
    await prisma.customer.delete({ where: { id } });
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: "فشل حذف العميل، قد يكون مرتبطًا ببيانات أخرى" }, { status: 400 });
  }
}
