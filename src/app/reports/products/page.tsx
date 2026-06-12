import { prisma } from "@/lib/prisma";
import { buildReportDateRange } from "@/lib/reportDateRange";
import { ReportDateRangeFilter } from "@/components/ReportDateRangeFilter";

export const dynamic = "force-dynamic";

export default async function ProductReportsPage(props: { searchParams?: Promise<{ startDate?: string; endDate?: string }> }) {
  const searchParams = await props.searchParams;
  const { startDate, endDate, createdAtWhere } = buildReportDateRange(searchParams);
  const products = await prisma.product.findMany({
    include: {
      sales: {
        where: createdAtWhere ? { createdAt: createdAtWhere } : undefined,
      },
      inventory: true,
      inventoryOperations: {
        where: createdAtWhere ? { createdAt: createdAtWhere } : undefined,
        include: { branch: true },
      },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-8 p-6">
      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
        <h1 className="text-3xl font-bold text-white">📦 تقرير المنتجات</h1>
        <p className="mt-2 text-slate-400">عرض أداء كل منتج من حيث المبيعات والمخزون والإيرادات.</p>
      </div>

      <ReportDateRangeFilter startDate={startDate} endDate={endDate} />

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
                      <p className="text-sm text-slate-400">عدد الامتار المباعة</p>
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
                  {product.inventoryOperations && product.inventoryOperations.length > 0 && (() => {
                    const grouped: Record<string, { name: string; ops: typeof product.inventoryOperations }> = {};
                    product.inventoryOperations.forEach((op) => {
                      const name = op.branch?.name ?? "فرع غير معروف";
                      if (!grouped[name]) grouped[name] = { name, ops: [] };
                      grouped[name].ops.push(op);
                    });

                    return (
                      <div className="mt-6 space-y-4">
                        <h3 className="text-lg font-medium text-white">📥 عمليات إضافة خامات مفصّلة حسب الفرع</h3>
                        {Object.values(grouped).map((g) => (
                          <div key={g.name} className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
                            <div className="flex items-center justify-between">
                              <div className="text-sm text-slate-200 font-semibold">{g.name}</div>
                              <div className="text-sm text-slate-400">الإجمالي: {g.ops.reduce((s, o) => s + o.quantity, 0)}</div>
                            </div>
                            <ul className="mt-3 space-y-2 text-slate-200">
                              {g.ops.map((op) => (
                                <li key={op.id} className="flex justify-between gap-4">
                                  <div className="text-sm text-slate-400">{new Date(op.createdAt).toLocaleString()}</div>
                                  <div className="text-sm font-semibold">كمية: {op.quantity}</div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
