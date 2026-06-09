import { prisma } from "@/lib/prisma";

// 📥 GET - كل المنتجات
export async function GET() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return Response.json(products);
}

// 📤 POST - إضافة منتج
export async function POST(req: Request) {
  const body = await req.json();

  if (!body.name) {
    return Response.json({ error: "Name required" }, { status: 400 });
  }

  const product = await prisma.product.create({
    data: {
      name: body.name,
      costPrice: Number(body.costPrice),
      sellingPrice: body.sellingPrice ? Number(body.sellingPrice) : null,
    },
  });

  return Response.json(product);
}