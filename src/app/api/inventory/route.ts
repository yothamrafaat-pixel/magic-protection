export const dynamic = "force-dynamic";
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
  try {
    const body = await req.json();

    const branchId = String(body.branchId || "").trim();
    const productId = String(body.productId || "").trim();
    const quantity = Number(body.quantity);
    const dateValue = body.date ? String(body.date) : "";
    const supplierId = body.supplierId ? String(body.supplierId).trim() : null;
    const supplierPrice = body.supplierPrice ? Number(body.supplierPrice) : null;

    if (!branchId || !productId) {
      return Response.json({ error: "الفرع أو المنتج مفقود" }, { status: 400 });
    }

    if (!Number.isFinite(quantity) || quantity <= 0) {
      return Response.json({ error: "الكمية غير صحيحة" }, { status: 400 });
    }

    const operationDate = dateValue ? new Date(dateValue) : new Date();
    if (Number.isNaN(operationDate.getTime())) {
      return Response.json({ error: "التاريخ غير صالح" }, { status: 400 });
    }

    const inventory = await prisma.inventory.upsert({
      where: {
        branchId_productId: {
          branchId,
          productId,
        },
      },
      update: {
        quantity: {
          increment: quantity,
        },
      },
      create: {
        branchId,
        productId,
        quantity,
      },
    });

    await prisma.inventoryOperation.create({
      data: {
        branchId,
        productId,
        quantity,
        createdAt: operationDate,
      },
    });

    // Create SupplierItem if supplier is selected
    if (supplierId) {
      try {
        await prisma.supplierItem.create({
          data: {
            supplier: { connect: { id: supplierId } },
            product: { connect: { id: productId } },
            price: supplierPrice,
            note: `مخزون إضافة: ${quantity} وحدة`,
          },
        });
      } catch (e) {
        // ignore if supplier not found or other error
      }
    }

    return Response.json(inventory);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "فشل إضافة المخزون";
    return Response.json({ error: message }, { status: 500 });
  }
}
