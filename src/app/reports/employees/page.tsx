import { prisma } from "@/lib/prisma";

export default async function EmployeeReportsPage() {
  const employees = await prisma.employee.findMany({
    include: {
      expenses: true,
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-8 p-6">
      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
        <h1 className="text-3xl font-bold text-white">👥 تقرير الموظفين</h1>
        <p className="mt-2 text-slate-400">عرض الرواتب والمصروفات المرتبطة بكل موظف.</p>
      </div>

      {employees.length === 0 ? (
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 text-slate-400">
          لا يوجد موظفين مسجلين حتى الآن.
        </div>
      ) : (
        <div className="space-y-6">
          {employees.map((employee) => {
            const totalExpenses = employee.expenses.reduce((sum, expense) => sum + expense.amount, 0);

            return (
              <section key={employee.id} className="rounded-3xl border border-slate-800 bg-slate-950 p-6 shadow-lg">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold text-white">{employee.name}</h2>
                    <p className="mt-1 text-slate-400">{employee.position || "الوظيفة غير محددة"}</p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-3xl bg-slate-900 p-4 text-slate-200">
                      <p className="text-sm text-slate-400">الراتب</p>
                      <p className="mt-2 text-xl font-semibold text-white">{employee.salary.toFixed(2)} EGP</p>
                    </div>
                    <div className="rounded-3xl bg-slate-900 p-4 text-slate-200">
                      <p className="text-sm text-slate-400">مجموع المصروفات</p>
                      <p className="mt-2 text-xl font-semibold text-white">{totalExpenses.toFixed(2)} EGP</p>
                    </div>
                  </div>
                </div>

                {employee.expenses.length > 0 ? (
                  <div className="mt-6 overflow-x-auto rounded-3xl border border-slate-800 bg-slate-900 shadow-sm">
                    <table className="min-w-full text-left text-sm text-slate-200">
                      <thead className="border-b border-slate-800 bg-slate-950 text-slate-400">
                        <tr>
                          <th className="px-4 py-3">الفئة</th>
                          <th className="px-4 py-3">المبلغ</th>
                          <th className="px-4 py-3">الوصف</th>
                          <th className="px-4 py-3">التاريخ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {employee.expenses.map((expense) => (
                          <tr key={expense.id} className="border-b border-slate-800 last:border-b-0">
                            <td className="px-4 py-3 text-white">{expense.category}</td>
                            <td className="px-4 py-3">{expense.amount.toFixed(2)} EGP</td>
                            <td className="px-4 py-3 text-slate-300">{expense.description || "بدون وصف"}</td>
                            <td className="px-4 py-3 text-slate-300">{new Date(expense.createdAt).toLocaleDateString("ar-EG")}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="mt-6 text-slate-400">لا توجد مصروفات مرتبطة بهذا الموظف.</p>
                )}
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
