import { prisma } from "@/lib/prisma";

export default async function BranchReportsPage() {
  const branches = await prisma.branch.findMany({
    include: {
      sales: {
        include: {
          product: true,
        },
      },
      inventory: {
        include: { product: true },
      },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-8 p-6">
      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
        <h1 className="text-3xl font-bold text-white">🏢 تقرير الفروع</h1>
        <p className="mt-2 text-slate-400">عرض أداء كل فرع مع حركة المبيعات والمخزون وإجمالي الإيرادات.</p>
      </div>

      {branches.length === 0 ? (
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 text-slate-400">
          لا توجد فروع مسجلة حتى الآن.
        </div>
      ) : (
        <div className="space-y-8">
          {branches.map((branch) => {
            const totalSales = branch.sales.length;
            const revenue = branch.sales.reduce((sum, sale) => sum + sale.totalSale, 0);
            const profit = branch.sales.reduce((sum, sale) => sum + sale.profit, 0);
            const totalInventory = branch.inventory.reduce((sum, item) => sum + item.quantity, 0);

            return (
              <section key={branch.id} className="rounded-3xl border border-slate-800 bg-slate-950 p-6 shadow-lg">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold text-white">{branch.name}</h2>
                    <p className="mt-1 text-slate-400">{branch.location || "الموقع غير محدد"}</p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-3xl bg-slate-900 p-4 text-slate-200">
                      <p className="text-sm text-slate-400">عدد المبيعات</p>
                      <p className="mt-2 text-xl font-semibold text-white">{totalSales}</p>
                    </div>
                    <div className="rounded-3xl bg-slate-900 p-4 text-slate-200">
                      <p className="text-sm text-slate-400">الإيرادات</p>
                      <p className="mt-2 text-xl font-semibold text-white">{revenue.toFixed(2)} EGP</p>
                    </div>
                    <div className="rounded-3xl bg-slate-900 p-4 text-slate-200">
                      <p className="text-sm text-slate-400">المخزون</p>
                      <p className="mt-2 text-xl font-semibold text-white">{totalInventory}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-3xl border border-slate-800 bg-slate-900 p-4 text-slate-200">
                    <p className="text-sm text-slate-400">الربح الإجمالي</p>
                    <p className="mt-2 text-xl font-semibold text-white">{profit.toFixed(2)} EGP</p>
                  </div>
                  <div className="rounded-3xl border border-slate-800 bg-slate-900 p-4 text-slate-200">
                    <p className="text-sm text-slate-400">عدد المنتجات في المخزون</p>
                    <p className="mt-2 text-xl font-semibold text-white">{branch.inventory.length}</p>
                  </div>
                </div>

                {branch.sales.length > 0 && (
                  <div className="mt-6 overflow-x-auto rounded-3xl border border-slate-800 bg-slate-900 shadow-sm">
                    <table className="min-w-full text-left text-sm text-slate-200">
                      <thead className="border-b border-slate-800 bg-slate-950 text-slate-400">
                        <tr>
                          <th className="px-4 py-3">المنتج</th>
                          <th className="px-4 py-3">الكمية</th>
                          <th className="px-4 py-3">الإيراد</th>
                          <th className="px-4 py-3">الربح</th>
                        </tr>
                      </thead>
                      <tbody>
                        {branch.sales.map((sale) => (
                          <tr key={sale.id} className="border-b border-slate-800 last:border-b-0">
                            <td className="px-4 py-3 text-white">{sale.product?.name || "غير معروف"}</td>
                            <td className="px-4 py-3">{sale.quantity}</td>
                            <td className="px-4 py-3">{sale.totalSale.toFixed(2)} EGP</td>
                            <td className="px-4 py-3">{sale.profit.toFixed(2)} EGP</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
