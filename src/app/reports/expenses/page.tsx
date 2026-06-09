import { prisma } from "@/lib/prisma";

export default async function ExpenseReportsPage() {
  const expenses = await prisma.expense.findMany({
    include: { employee: true },
    orderBy: { createdAt: "desc" },
  });

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="space-y-8 p-6">
      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
        <h1 className="text-3xl font-bold text-white">🧾 تقرير المصروفات</h1>
        <p className="mt-2 text-slate-400">عرض جميع المصروفات مع تصنيفها وربطها بالموظفين إن وجد.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-3xl border border-slate-800 bg-slate-950 p-6 text-slate-200">
          <p className="text-sm text-slate-400">إجمالي المصروفات</p>
          <p className="mt-2 text-3xl font-semibold text-white">{totalExpenses.toFixed(2)} EGP</p>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-slate-950 p-6 text-slate-200">
          <p className="text-sm text-slate-400">عدد السجلات</p>
          <p className="mt-2 text-3xl font-semibold text-white">{expenses.length}</p>
        </div>
      </div>

      {expenses.length === 0 ? (
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 text-slate-400">
          لا توجد مصروفات حتى الآن.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-slate-950 shadow-lg">
          <table className="min-w-full text-left text-sm text-slate-200">
            <thead className="border-b border-slate-800 bg-slate-900 text-slate-400">
              <tr>
                <th className="px-4 py-3">الفئة</th>
                <th className="px-4 py-3">المبلغ</th>
                <th className="px-4 py-3">الموظف</th>
                <th className="px-4 py-3">الوصف</th>
                <th className="px-4 py-3">التاريخ</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr key={expense.id} className="border-b border-slate-800 last:border-b-0">
                  <td className="px-4 py-3 text-white">{expense.category}</td>
                  <td className="px-4 py-3">{expense.amount.toFixed(2)} EGP</td>
                  <td className="px-4 py-3 text-slate-300">{expense.employee?.name || "عام"}</td>
                  <td className="px-4 py-3 text-slate-300">{expense.description || "بدون وصف"}</td>
                  <td className="px-4 py-3 text-slate-300">{new Date(expense.createdAt).toLocaleDateString("ar-EG")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
