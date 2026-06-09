import { prisma } from "@/lib/prisma";

export default async function InventoryReportsPage() {
  const inventory = await prisma.inventory.findMany({
    include: {
      branch: true,
      product: true,
    },
    orderBy: {
      branch: { name: "asc" },
    },
  });

  return (
    <div className="space-y-8 p-6">
      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
        <h1 className="text-3xl font-bold text-white">📉 تقرير المخزون</h1>
        <p className="mt-2 text-slate-400">عرض كميات المخزون لكل منتج في كل فرع بالتفصيل.</p>
      </div>

      {inventory.length === 0 ? (
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 text-slate-400">
          لا يوجد بيانات مخزون حتى الآن.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-slate-950 shadow-lg">
          <table className="min-w-full text-left text-sm text-slate-200">
            <thead className="bg-slate-900 text-slate-400">
              <tr>
                <th className="px-4 py-3">الفرع</th>
                <th className="px-4 py-3">المنتج</th>
                <th className="px-4 py-3">الكمية</th>
                <th className="px-4 py-3">سعر التكلفة</th>
                <th className="px-4 py-3">سعر البيع</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item) => (
                <tr key={item.id} className="border-b border-slate-800 last:border-b-0">
                  <td className="px-4 py-3 text-white">{item.branch?.name || "غير معروف"}</td>
                  <td className="px-4 py-3 text-white">{item.product?.name || "غير معروف"}</td>
                  <td className="px-4 py-3">{item.quantity}</td>
                  <td className="px-4 py-3">{item.product?.costPrice ?? "-"} EGP</td>
                  <td className="px-4 py-3">{item.product?.sellingPrice ?? "-"} EGP</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
