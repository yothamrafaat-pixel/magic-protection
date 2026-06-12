import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-72 min-h-screen fixed bg-slate-950 border-r border-slate-800 p-6 shadow-xl">
      <div className="mb-10">
        <div className="text-3xl font-black text-cyan-300">Magic Protection</div>
        <p className="mt-2 text-sm text-slate-400">
          Car protection ERP for multi-branch operations
        </p>
      </div>

      <nav className="space-y-3 text-slate-200">
        <Link className="block rounded-xl px-4 py-3 hover:bg-slate-900 hover:text-white" href="/">📊 Dashboard</Link>
        <Link className="block rounded-xl px-4 py-3 hover:bg-slate-900 hover:text-white" href="/sales">💸 Sales</Link>
        <Link className="block rounded-xl px-4 py-3 hover:bg-slate-900 hover:text-white" href="/sales/new">💰 New Sale</Link>
        <Link className="block rounded-xl px-4 py-3 hover:bg-slate-900 hover:text-white" href="/products">📦 Products</Link>
        <Link className="block rounded-xl px-4 py-3 hover:bg-slate-900 hover:text-white" href="/branches">🏢 Branches</Link>
        <Link className="block rounded-xl px-4 py-3 hover:bg-slate-900 hover:text-white" href="/inventory">📉 Inventory</Link>
        <Link className="block rounded-xl px-4 py-3 hover:bg-slate-900 hover:text-white" href="/customers">👤 Customers</Link>
        <Link className="block rounded-xl px-4 py-3 hover:bg-slate-900 hover:text-white" href="/employees">👥 Employees</Link>
        <Link className="block rounded-xl px-4 py-3 hover:bg-slate-900 hover:text-white" href="/suppliers">🏭 Suppliers</Link>
        <Link className="block rounded-xl px-4 py-3 hover:bg-slate-900 hover:text-white" href="/expenses">🧾 Expenses</Link>

        <div className="mt-6 rounded-3xl border border-slate-800 bg-slate-900 p-4 text-sm text-slate-400">
          <div className="mb-2 font-semibold text-slate-100">Reports</div>
          <Link className="block rounded-xl px-4 py-2 hover:bg-slate-800 hover:text-white" href="/reports">📂 نظرة عامة للتقارير</Link>
          <Link className="block rounded-xl px-4 py-2 hover:bg-slate-800 hover:text-white" href="/reports/branches">🏢 فروع</Link>
          <Link className="block rounded-xl px-4 py-2 hover:bg-slate-800 hover:text-white" href="/reports/products">📦 منتجات</Link>
          <Link className="block rounded-xl px-4 py-2 hover:bg-slate-800 hover:text-white" href="/reports/customers">👤 عملاء</Link>
          <Link className="block rounded-xl px-4 py-2 hover:bg-slate-800 hover:text-white" href="/reports/employees">👥 موظفين</Link>
          <Link className="block rounded-xl px-4 py-2 hover:bg-slate-800 hover:text-white" href="/reports/inventory">📉 مخزون</Link>
          <Link className="block rounded-xl px-4 py-2 hover:bg-slate-800 hover:text-white" href="/reports/suppliers">🏭 موردين</Link>
          <Link className="block rounded-xl px-4 py-2 hover:bg-slate-800 hover:text-white" href="/reports/expenses">🧾 مصروفات</Link>
          <Link className="block rounded-xl px-4 py-2 hover:bg-slate-800 hover:text-white" href="/reports/general">📋 التقرير العام</Link>
          <Link className="block rounded-xl px-4 py-2 hover:bg-slate-800 hover:text-white" href="/reports/sales-history">🗓️ تاريخ المبيعات</Link>
        </div>
      </nav>
    </aside>
  );
}