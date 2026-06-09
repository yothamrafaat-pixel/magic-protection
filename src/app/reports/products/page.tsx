import { prisma } from "@/lib/prisma";

export default async function ProductReportsPage() {
  const products = await prisma.product.findMany({
    include: {
      sales: true,
      inventory: true,
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-8 p-6">
      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
        <h1 className="text-3xl font-bold text-white">📦 تقرير المنتجات</h1>
        <p className="mt-2 text-slate-400">عرض أداء كل منتج من حيث المبيعات والمخزون والإيرادات.</p>
      </div>

      {products.length === 0 ? (
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 text-slate-400">
          لا توجد منتجات مسجلة حتى الآن.
        </div>
      ) : (
        <div className="space-y-6">
          {products.map((product) => {
            const totalSold = product.sales.reduce((sum, sale) => sum + sale.quantity, 0);
            const revenue = product.sales.reduce((sum, sale) => sum + sale.totalSale, 0);
            const stock = product.inventory.reduce((sum, item) => sum + item.quantity, 0);

            return (
              <section key={product.id} className="rounded-3xl border border-slate-800 bg-slate-950 p-6 shadow-lg">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold text-white">{product.name}</h2>
                    <p className="mt-1 text-slate-400">سعر التكلفة: {product.costPrice} EGP - سعر البيع: {product.sellingPrice ?? "غير محدد"} EGP</p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-3xl bg-slate-900 p-4 text-slate-200">
                      <p className="text-sm text-slate-400">الكمية المباعة</p>
                      <p className="mt-2 text-xl font-semibold text-white">{totalSold}</p>
                    </div>
                    <div className="rounded-3xl bg-slate-900 p-4 text-slate-200">
                      <p className="text-sm text-slate-400">الإيرادات</p>
                      <p className="mt-2 text-xl font-semibold text-white">{revenue.toFixed(2)} EGP</p>
                    </div>
                    <div className="rounded-3xl bg-slate-900 p-4 text-slate-200">
                      <p className="text-sm text-slate-400">المخزون الحالي</p>
                      <p className="mt-2 text-xl font-semibold text-white">{stock}</p>
                    </div>
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
