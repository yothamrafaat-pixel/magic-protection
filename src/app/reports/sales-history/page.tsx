import { prisma } from "@/lib/prisma";

export default async function BranchSalesHistoryPage() {
  const branches = await prisma.branch.findMany({
    include: {
      sales: {
        include: {
          customer: true,
          product: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
        <h1 className="text-3xl font-bold text-white">📈 تاريخ المبيعات حسب الفرع</h1>
        <p className="mt-2 text-slate-400">
          عرض كل المبيعات المفصلة لكل فرع مع إجمالي الإيرادات والربح.
        </p>
      </div>

      {branches.length === 0 ? (
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-lg">
          <p className="text-slate-400">لا توجد فروع مسجلة حتى الآن.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {branches.map((branch) => {
            const totalSales = branch.sales.length;
            const totalRevenue = branch.sales.reduce((sum, sale) => sum + sale.totalSale, 0);
            const totalProfit = branch.sales.reduce((sum, sale) => sum + sale.profit, 0);

            return (
              <section key={branch.id} className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-lg">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold text-white">{branch.name}</h2>
                    <p className="mt-1 text-slate-400">{branch.location || "الموقع غير محدد"}</p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-3xl bg-slate-950 p-4 text-slate-200">
                      <p className="text-sm text-slate-400">إجمالي المبيعات</p>
                      <p className="mt-2 text-xl font-semibold text-white">{totalSales}</p>
                    </div>
                    <div className="rounded-3xl bg-slate-950 p-4 text-slate-200">
                      <p className="text-sm text-slate-400">الإيرادات</p>
                      <p className="mt-2 text-xl font-semibold text-white">{totalRevenue.toFixed(2)} EGP</p>
                    </div>
                    <div className="rounded-3xl bg-slate-950 p-4 text-slate-200">
                      <p className="text-sm text-slate-400">الربح</p>
                      <p className="mt-2 text-xl font-semibold text-white">{totalProfit.toFixed(2)} EGP</p>
                    </div>
                  </div>
                </div>

                {branch.sales.length === 0 ? (
                  <p className="mt-6 text-slate-400">لا توجد مبيعات في هذا الفرع بعد.</p>
                ) : (
                  <div className="mt-6 overflow-x-auto rounded-3xl border border-slate-800 bg-slate-950 shadow-sm">
                    <table className="min-w-full text-left text-sm text-slate-200">
                      <thead className="border-b border-slate-800 bg-slate-900 text-slate-400">
                        <tr>
                          <th className="px-4 py-3">التاريخ</th>
                          <th className="px-4 py-3">العميل</th>
                          <th className="px-4 py-3">المنتج</th>
                          <th className="px-4 py-3">الكمية</th>
                          <th className="px-4 py-3">سعر الوحدة</th>
                          <th className="px-4 py-3">الإجمالي</th>
                          <th className="px-4 py-3">الربح</th>
                        </tr>
                      </thead>
                      <tbody>
                        {branch.sales.map((sale) => (
                          <tr key={sale.id} className="border-b border-slate-800 last:border-b-0">
                            <td className="px-4 py-3 text-slate-300">{new Date(sale.createdAt).toLocaleString("ar-EG", { dateStyle: "short", timeStyle: "short" })}</td>
                            <td className="px-4 py-3 text-white">{sale.customer?.name ?? "عميل جديد"}</td>
                            <td className="px-4 py-3 text-slate-300">{sale.product?.name ?? "غير معروف"}</td>
                            <td className="px-4 py-3">{sale.quantity}</td>
                            <td className="px-4 py-3">{sale.salePrice.toFixed(2)} EGP</td>
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
