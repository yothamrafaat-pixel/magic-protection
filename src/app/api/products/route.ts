export const dynamic = "force-dynamic";
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

  // If supplierId is provided we will create a SupplierItem linked to the product
  const supplierId = body.supplierId;
  const supplierPrice = body.supplierPrice ? Number(body.supplierPrice) : null;
  const productNote = body.note ?? null;

  // Validate supplier existence when supplied
  if (supplierId) {
    const supplierExists = await prisma.supplier.findUnique({ where: { id: supplierId } });
    if (!supplierExists) {
      return Response.json({ error: "Supplier not found" }, { status: 400 });
    }
  }

  const product = await prisma.product.create({
    data: {
      name: body.name,
      note: productNote,
      costPrice: Number(body.costPrice),
      sellingPrice: body.sellingPrice ? Number(body.sellingPrice) : null,
      supplierItems: supplierId
        ? {
            create: {
              supplier: { connect: { id: supplierId } },
              price: supplierPrice,
              note: body.supplierNote ?? null,
            },
          }
        : undefined,
    },
  });

  return Response.json(product);
}