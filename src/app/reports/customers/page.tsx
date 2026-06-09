import { prisma } from "@/lib/prisma";

export default async function CustomerReportsPage() {
  const customers = await prisma.customer.findMany({
    include: {
      sales: {
        include: {
          product: true,
        },
      },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-8 p-6">
      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
        <h1 className="text-3xl font-bold text-white">👤 تقرير العملاء</h1>
        <p className="mt-2 text-slate-400">عرض كل عميل مع مشترياته وإجمالي ما أنفقه.</p>
      </div>

      {customers.length === 0 ? (
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 text-slate-400">
          لا توجد عملاء مسجلين حتى الآن.
        </div>
      ) : (
        <div className="space-y-6">
          {customers.map((customer) => {
            const totalSales = customer.sales.length;
            const spent = customer.sales.reduce((sum, sale) => sum + sale.totalSale, 0);

            return (
              <section key={customer.id} className="rounded-3xl border border-slate-800 bg-slate-950 p-6 shadow-lg">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold text-white">{customer.name}</h2>
                    <p className="mt-1 text-slate-400">الهاتف: {customer.phone || "غير موجود"}</p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-3xl bg-slate-900 p-4 text-slate-200">
                      <p className="text-sm text-slate-400">عدد المبيعات</p>
                      <p className="mt-2 text-xl font-semibold text-white">{totalSales}</p>
                    </div>
                    <div className="rounded-3xl bg-slate-900 p-4 text-slate-200">
                      <p className="text-sm text-slate-400">الإجمالي المدفوع</p>
                      <p className="mt-2 text-xl font-semibold text-white">{spent.toFixed(2)} EGP</p>
                    </div>
                  </div>
                </div>

                {customer.sales.length > 0 ? (
                  <div className="mt-6 overflow-x-auto rounded-3xl border border-slate-800 bg-slate-900 shadow-sm">
                    <table className="min-w-full text-left text-sm text-slate-200">
                      <thead className="border-b border-slate-800 bg-slate-950 text-slate-400">
                        <tr>
                          <th className="px-4 py-3">المنتج</th>
                          <th className="px-4 py-3">الكمية</th>
                          <th className="px-4 py-3">الإجمالي</th>
                          <th className="px-4 py-3">التاريخ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {customer.sales.map((sale) => (
                          <tr key={sale.id} className="border-b border-slate-800 last:border-b-0">
                            <td className="px-4 py-3 text-white">{sale.product?.name || "غير معروف"}</td>
                            <td className="px-4 py-3">{sale.quantity}</td>
                            <td className="px-4 py-3">{sale.totalSale.toFixed(2)} EGP</td>
                            <td className="px-4 py-3 text-slate-300">{new Date(sale.createdAt).toLocaleDateString("ar-EG")}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="mt-6 text-slate-400">لم يقم هذا العميل بأي مشتريات حتى الآن.</p>
                )}
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
