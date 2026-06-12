export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const suppliers = await prisma.supplier.findMany({ orderBy: { name: "asc" } });
  return Response.json(suppliers);
}

export async function POST(req: Request) {
  const body = await req.json();
  if (!body.name) return Response.json({ error: "Name required" }, { status: 400 });

  const supplier = await prisma.supplier.create({ data: { name: body.name, contact: body.contact ?? null } });
  return Response.json(supplier);
}
