export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const body = await req.json();

  const branch = await prisma.branch.update({
    where: { id },
    data: {
      name: body.name,
      location: body.location || null,
    },
  });

  return Response.json(branch);
}

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    await prisma.branch.delete({
      where: { id },
    });

    return Response.json({ success: true });
  } catch {
    return Response.json(
      { error: "Delete failed" },
      { status: 400 }
    );
  }
}