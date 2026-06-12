import { prisma } from "@/lib/prisma";
import { buildReportDateRange } from "@/lib/reportDateRange";
import { ReportDateRangeFilter } from "@/components/ReportDateRangeFilter";

export const dynamic = "force-dynamic";

export default async function SuppliersReportPage(props: { searchParams?: Promise<{ startDate?: string; endDate?: string }> }) {
  const searchParams = await props.searchParams;
  const { startDate, endDate, createdAtWhere } = buildReportDateRange(searchParams);

  const suppliers = await prisma.supplier.findMany({
    include: {
      supplierItems: {
        where: createdAtWhere ? { createdAt: createdAtWhere } : undefined,
        include: { product: true },
        orderBy: { createdAt: "desc" },
      },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-8 p-6">
      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
        <h1 className="text-3xl font-bold text-white">🏭 تقرير الموردين</h1>
        <p className="mt-2 text-slate-400">عرض كامل بيانات الموردين والمنتجات المرتبطة بهم وأسعارهم.</p>
      </div>

      <ReportDateRangeFilter startDate={startDate} endDate={endDate} />

      {suppliers.length === 0 ? (
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 text-slate-400">
          لا توجد موردين مسجلة حتى الآن.
        </div>
      ) : (
        <div className="space-y-6">
          {suppliers.map((supplier) => (
            <section key={supplier.id} className="rounded-3xl border border-slate-800 bg-slate-950 p-6 shadow-lg">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-white">{supplier.name}</h2>
                  <p className="mt-1 text-slate-400">جهة اتصال: {supplier.contact ?? "بدون بيانات"}</p>
                </div>
                <div className="rounded-3xl bg-slate-900 p-4 text-slate-200">
                  <p className="text-sm text-slate-400">عدد المنتجات المرتبطة</p>
                  <p className="mt-2 text-xl font-semibold text-white">{supplier.supplierItems.length}</p>
                </div>
              </div>

              {supplier.supplierItems && supplier.supplierItems.length > 0 && (
                <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-4">
                  <h3 className="text-lg font-medium text-white">📦 المنتجات المرتبطة</h3>
                  <div className="mt-4 overflow-x-auto">
                    <table className="min-w-full border-separate border-spacing-0 text-slate-200">
                      <thead className="bg-slate-950 text-left text-xs uppercase tracking-[0.2em] text-slate-400">
                        <tr>
                          <th className="px-4 py-3">المنتج</th>
                          <th className="px-4 py-3">السعر</th>
                          <th className="px-4 py-3">الملاحظة</th>
                          <th className="px-4 py-3">تاريخ التسجيل</th>
                        </tr>
                      </thead>
                      <tbody>
                        {supplier.supplierItems.map((item) => (
                          <tr key={item.id} className="border-t border-slate-800">
                            <td className="px-4 py-3 font-semibold">{item.product?.name ?? "منتج غير معروف"}</td>
                            <td className="px-4 py-3">{item.price ? `${item.price} EGP` : "-"}</td>
                            <td className="px-4 py-3 text-slate-400">{item.note ?? "-"}</td>
                            <td className="px-4 py-3 text-xs text-slate-500">{new Date(item.createdAt).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
