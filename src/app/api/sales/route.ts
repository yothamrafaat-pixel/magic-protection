import { prisma } from "@/lib/prisma";

export async function GET() {
  const sales = await prisma.sale.findMany({
    include: {
      customer: true,
      product: true,
      branch: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return Response.json(sales);
}

export async function POST(req: Request) {
  const body = await req.json();

  // 👤 Customer Auto Create
  const customer = await prisma.customer.upsert({
    where: { phone: body.phone },
    update: {
      name: body.name,
    },
    create: {
      name: body.name,
      phone: body.phone,
    },
  });

  // 📦 Product
  const product = await prisma.product.findUnique({
    where: { id: body.productId },
  });

  if (!product) {
    return Response.json({ error: "Product not found" }, { status: 404 });
  }

  const quantity = Number(body.quantity);
  const salePrice = Number(body.salePrice);
  const unitCost = Number(body.unitCost ?? product.costPrice);

  const totalSale = salePrice;
  const profit = salePrice - unitCost;

  // 📦 Check Inventory
  const inventory = await prisma.inventory.findUnique({
    where: {
      branchId_productId: {
        branchId: body.branchId,
        productId: body.productId,
      },
    },
  });

  if (!inventory || inventory.quantity < quantity) {
    return Response.json({ error: "Not enough stock" }, { status: 400 });
  }

  // 🔻 Deduct Stock
  await prisma.inventory.update({
    where: {
      branchId_productId: {
        branchId: body.branchId,
        productId: body.productId,
      },
    },
    data: {
      quantity: {
        decrement: quantity,
      },
    },
  });

  // 💰 Create Sale
  const sale = await prisma.sale.create({
    data: {
      branchId: body.branchId,
      customerId: customer.id,
      productId: body.productId,
      quantity,
      salePrice,
      totalSale,
      profit,
    },
  });

  return Response.json(sale);
}