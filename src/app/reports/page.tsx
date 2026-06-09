import Link from "next/link";

export default function ReportsIndexPage() {
  const reports = [
    { href: "/reports/branches", label: "تقارير الفروع", description: "عرض أداء كل فرع وإجمالي الإيرادات والربح." },
    { href: "/reports/products", label: "تقارير المنتجات", description: "عرض كل منتج، المبيعات، المخزون، والإيرادات." },
    { href: "/reports/customers", label: "تقارير العملاء", description: "عرض سجل كل عميل والمبلغ الذي أنفقه." },
    { href: "/reports/employees", label: "تقارير الموظفين", description: "عرض الرواتب والمصروفات المرتبطة بكل موظف." },
    { href: "/reports/inventory", label: "تقارير المخزون", description: "عرض حالة المخزون لكل منتج في كل فرع." },
    { href: "/reports/expenses", label: "تقارير المصروفات", description: "عرض المصروفات الكاملة مع تصنيفها وربطها بالموظفين." },
    { href: "/reports/sales-history", label: "تاريخ مبيعات الفروع", description: "عرض تاريخ المبيعات المفصلة لكل فرع." },
  ];

  return (
    <div className="space-y-8 p-6">
      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
        <h1 className="text-3xl font-bold text-white">📊 تقارير شاملة</h1>
        <p className="mt-2 text-slate-400">اختر تقريراً منفصلاً لكل كيان لمراجعة الحسابات والمبيعات والمصروفات بسهولة.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {reports.map((report) => (
          <Link
            key={report.href}
            href={report.href}
            className="block rounded-3xl border border-slate-800 bg-slate-950 p-6 text-white transition hover:border-cyan-500 hover:bg-slate-900"
          >
            <h2 className="text-xl font-semibold">{report.label}</h2>
            <p className="mt-3 text-slate-400">{report.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
