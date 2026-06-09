import { prisma } from "@/lib/prisma";

// 📥 GET - عرض المخزون لكل الفروع
export async function GET() {
  const inventory = await prisma.inventory.findMany({
    include: {
      branch: true,
      product: true,
    },
    orderBy: {
      quantity: "desc",
    },
  });

  return Response.json(inventory);
}

// 📤 POST - إضافة أو تحديث المخزون
export async function POST(req: Request) {
  const body = await req.json();

  const inventory = await prisma.inventory.upsert({
    where: {
      branchId_productId: {
        branchId: body.branchId,
        productId: body.productId,
      },
    },
    update: {
      quantity: {
        increment: Number(body.quantity),
      },
    },
    create: {
      branchId: body.branchId,
      productId: body.productId,
      quantity: Number(body.quantity),
    },
  });

  return Response.json(inventory);
}