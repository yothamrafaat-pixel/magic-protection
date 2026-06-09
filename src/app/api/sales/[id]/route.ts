import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id: saleId } = await context.params;
  const body = await req.json();

  const sale = await prisma.sale.findUnique({
    where: { id: saleId },
    include: { product: true },
  });

  if (!sale) {
    return Response.json({ error: "Sale not found" }, { status: 404 });
  }

  const data: any = {};

  if (body.salePrice !== undefined) {
    const unitCost = sale.product?.costPrice ?? 0;
    data.salePrice = Number(body.salePrice);
    data.totalSale = Number(body.salePrice);
    data.profit = Number(body.salePrice) - unitCost;
  }

  if (body.quantity !== undefined) {
    const newQuantity = Number(body.quantity);
    const quantityDifference = newQuantity - sale.quantity;
    data.quantity = newQuantity;

    if (quantityDifference !== 0) {
      const inventory = await prisma.inventory.findUnique({
        where: {
          branchId_productId: {
            branchId: sale.branchId,
            productId: sale.productId,
          },
        },
      });

      if (!inventory && quantityDifference > 0) {
        return Response.json({ error: "Not enough stock to increase sale quantity" }, { status: 400 });
      }

      if (inventory) {
        if (quantityDifference > inventory.quantity) {
          return Response.json({ error: "Not enough stock to increase sale quantity" }, { status: 400 });
        }

        await prisma.inventory.update({
          where: {
            branchId_productId: {
              branchId: sale.branchId,
              productId: sale.productId,
            },
          },
          data: {
            quantity: {
              decrement: quantityDifference,
            },
          },
        });
      }

      if (quantityDifference < 0) {
        await prisma.inventory.upsert({
          where: {
            branchId_productId: {
              branchId: sale.branchId,
              productId: sale.productId,
            },
          },
          update: {
            quantity: {
              increment: Math.abs(quantityDifference),
            },
          },
          create: {
            branchId: sale.branchId,
            productId: sale.productId,
            quantity: Math.abs(quantityDifference),
          },
        });
      }
    }
  }

  const updatedSale = await prisma.sale.update({
    where: { id: saleId },
    data,
  });

  return Response.json(updatedSale);
}

export async function DELETE(_req: Request, context: { params: Promise<{ id: string }> }) {
  const { id: saleId } = await context.params;

  const sale = await prisma.sale.findUnique({
    where: { id: saleId },
  });

  if (!sale) {
    return Response.json({ error: "Sale not found" }, { status: 404 });
  }

  await prisma.inventory.upsert({
    where: {
      branchId_productId: {
        branchId: sale.branchId,
        productId: sale.productId,
      },
    },
    update: {
      quantity: {
        increment: sale.quantity,
      },
    },
    create: {
      branchId: sale.branchId,
      productId: sale.productId,
      quantity: sale.quantity,
    },
  });

  await prisma.sale.delete({
    where: { id: saleId },
  });

  return Response.json({ success: true });
}
