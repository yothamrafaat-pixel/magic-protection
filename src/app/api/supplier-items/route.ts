export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";

// POST: create a supplier item (link supplier + product)
export async function POST(req: Request) {
  const body = await req.json();

  const { supplierId, productId, price, note } = body;
  if (!supplierId || !productId) {
    return Response.json({ error: "supplierId and productId are required" }, { status: 400 });
  }

  // validate existence
  const supplier = await prisma.supplier.findUnique({ where: { id: supplierId } });
  if (!supplier) return Response.json({ error: "Supplier not found" }, { status: 400 });

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) return Response.json({ error: "Product not found" }, { status: 400 });

  const item = await prisma.supplierItem.create({
    data: {
      supplier: { connect: { id: supplierId } },
      product: { connect: { id: productId } },
      price: price ? Number(price) : null,
      note: note ?? null,
    },
  });

  return Response.json(item);
}
