export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";

// GET
export async function GET() {
  try {
    const branches = await prisma.branch.findMany({
      orderBy: { createdAt: "desc" },
    });

    return Response.json(branches);
  } catch (error) {
    console.error("Branches GET error:", error);
    return Response.json({ error: "فشل تحميل الفروع" }, { status: 500 });
  }
}

// POST
export async function POST(req: Request) {
  const body = await req.json();

  const branch = await prisma.branch.create({
    data: {
      name: body.name,
      location: body.location || null,
    },
  });

  return Response.json(branch);
}