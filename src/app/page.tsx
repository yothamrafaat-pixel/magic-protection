import { prisma } from "@/lib/prisma";

export default async function Dashboard() {
  const branchesCount = await prisma.branch.count();
  const productsCount = await prisma.product.count();
  const inventoryCount = await prisma.inventory.count();
  const customersCount = await prisma.customer.count();
  const salesCount = await prisma.sale.count();

  const sales = await prisma.sale.findMany();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const salesToday = sales.filter((s) => new Date(s.createdAt) >= today);
  const salesMonth = sales.filter((s) => new Date(s.createdAt) >= startOfMonth);

  const sum = (arr: any[], key: string) =>
    arr.reduce((acc, item) => acc + (item[key] || 0), 0);

  const todayRevenue = sum(salesToday, "totalSale");
  const monthRevenue = sum(salesMonth, "totalSale");
  const totalProfit = sum(sales, "profit");

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-300/80">
          Magic Protection
        </p>
        <h1 className="mt-4 text-4xl font-extrabold text-white">
          مركز إدارة حماية السيارات
        </h1>
        <p className="mt-3 max-w-2xl text-slate-400">
          لوحة تحكم متكاملة لإدارة الفروع، المنتجات، المخزون، العملاء والمبيعات لكل فروع شركتك.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-5">
        <div className="rounded-3xl bg-slate-900 p-6 shadow-lg border border-slate-800">
          <p className="text-sm text-slate-400">الفروع</p>
          <p className="mt-4 text-3xl font-bold text-white">{branchesCount}</p>
        </div>
        <div className="rounded-3xl bg-slate-900 p-6 shadow-lg border border-slate-800">
          <p className="text-sm text-slate-400">المنتجات</p>
          <p className="mt-4 text-3xl font-bold text-white">{productsCount}</p>
        </div>
        <div className="rounded-3xl bg-slate-900 p-6 shadow-lg border border-slate-800">
          <p className="text-sm text-slate-400">المخزون</p>
          <p className="mt-4 text-3xl font-bold text-white">{inventoryCount}</p>
        </div>
        <div className="rounded-3xl bg-slate-900 p-6 shadow-lg border border-slate-800">
          <p className="text-sm text-slate-400">العملاء</p>
          <p className="mt-4 text-3xl font-bold text-white">{customersCount}</p>
        </div>
        <div className="rounded-3xl bg-slate-900 p-6 shadow-lg border border-slate-800">
          <p className="text-sm text-slate-400">عدد المبيعات</p>
          <p className="mt-4 text-3xl font-bold text-white">{salesCount}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl bg-slate-900 p-6 shadow-lg border border-slate-800">
          <p className="text-sm text-slate-400">مبيعات اليوم</p>
          <p className="mt-4 text-3xl font-bold text-cyan-300">{todayRevenue} EGP</p>
        </div>
        <div className="rounded-3xl bg-slate-900 p-6 shadow-lg border border-slate-800">
          <p className="text-sm text-slate-400">مبيعات الشهر</p>
          <p className="mt-4 text-3xl font-bold text-cyan-300">{monthRevenue} EGP</p>
        </div>
        <div className="rounded-3xl bg-slate-900 p-6 shadow-lg border border-slate-800">
          <p className="text-sm text-slate-400">إجمالي الربح</p>
          <p className="mt-4 text-3xl font-bold text-cyan-300">{totalProfit} EGP</p>
        </div>
      </div>
    </div>
  );
}