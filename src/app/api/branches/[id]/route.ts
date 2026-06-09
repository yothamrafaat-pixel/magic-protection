import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const body = await req.json();

  const branch = await prisma.branch.update({
    where: { id: params.id },
    data: {
      name: body.name,
      location: body.location || null,
    },
  });

  return Response.json(branch);
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.branch.delete({
      where: { id: params.id },
    });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json(
      { error: "Delete failed" },
      { status: 400 }
    );
  }
}