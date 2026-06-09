"use client";

import { useEffect, useMemo, useState } from "react";

type Sale = {
  id: string;
  branchId: string;
  productId: string;
  customerId: string;
  quantity: number;
  salePrice: number;
  totalSale: number;
  profit: number;
  createdAt: string;
  customer?: { name: string };
  product?: { name: string };
  branch?: { name: string };
};

export default function SalesPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ salePrice: 0, quantity: 1 });

  const loadSales = async () => {
    setLoading(true);
    const res = await fetch("/api/sales");
    const data = await res.json();
    setSales(data);
    setLoading(false);
  };

  useEffect(() => {
    loadSales();
  }, []);

  const startEdit = (sale: Sale) => {
    setEditingId(sale.id);
    setEditForm({ salePrice: sale.salePrice, quantity: sale.quantity });
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveEdit = async (saleId: string) => {
    const res = await fetch(`/api/sales/${saleId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    });

    if (!res.ok) {
      const error = await res.json();
      alert(error.error || "فشل تحديث العملية");
      return;
    }

    await loadSales();
    setEditingId(null);
  };

  const deleteSale = async (saleId: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه العملية؟")) {
      return;
    }

    const res = await fetch(`/api/sales/${saleId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const error = await res.json();
      alert(error.error || "فشل حذف العملية");
      return;
    }

    await loadSales();
  };

  const salesWithDate = useMemo(
    () =>
      sales.map((sale) => ({
        ...sale,
        prettyDate: new Date(sale.createdAt).toLocaleString("ar-EG", {
          dateStyle: "short",
          timeStyle: "short",
        }),
      })),
    [sales]
  );

  return (
    <div className="space-y-6 p-6">
      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
        <h1 className="text-3xl font-bold text-white">💸 المبيعات</h1>
        <p className="mt-2 text-slate-400">عرض وتحرير وحذف أي عملية مبيعات بالتواريخ.</p>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-800 text-slate-200">
          <thead>
            <tr className="text-left text-sm text-slate-400">
              <th className="px-4 py-3">التاريخ</th>
              <th className="px-4 py-3">العميل</th>
              <th className="px-4 py-3">الفرع</th>
              <th className="px-4 py-3">المنتج</th>
              <th className="px-4 py-3">الكمية</th>
              <th className="px-4 py-3">سعر الوحدة</th>
              <th className="px-4 py-3">الربح</th>
              <th className="px-4 py-3">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {salesWithDate.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-6 text-center text-slate-400">
                  {loading ? "جاري التحميل..." : "لا توجد عمليات مبيعات"}
                </td>
              </tr>
            ) : (
              salesWithDate.map((sale) => (
                <tr key={sale.id} className="hover:bg-slate-950">
                  <td className="px-4 py-3 text-slate-300">{sale.prettyDate}</td>
                  <td className="px-4 py-3 text-white">{sale.customer?.name ?? "عميل جديد"}</td>
                  <td className="px-4 py-3 text-slate-300">{sale.branch?.name ?? "-"}</td>
                  <td className="px-4 py-3 text-slate-300">{sale.product?.name ?? "غير معروف"}</td>
                  <td className="px-4 py-3">
                    {editingId === sale.id ? (
                      <input
                        className="w-20 rounded-2xl border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none"
                        type="number"
                        min={1}
                        value={editForm.quantity}
                        onChange={(e) => setEditForm({ ...editForm, quantity: Number(e.target.value) })}
                      />
                    ) : (
                      sale.quantity
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-300">
                    {editingId === sale.id ? (
                      <input
                        className="w-24 rounded-2xl border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none"
                        type="number"
                        min={0}
                        value={editForm.salePrice}
                        onChange={(e) => setEditForm({ ...editForm, salePrice: Number(e.target.value) })}
                      />
                    ) : (
                      `${sale.salePrice.toFixed(2)} EGP`
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-200">{sale.profit.toFixed(2)} EGP</td>
                  <td className="px-4 py-3 space-x-2">
                    {editingId === sale.id ? (
                      <>
                        <button
                          className="rounded-2xl bg-cyan-500 px-3 py-1 text-sm font-semibold text-slate-950"
                          onClick={() => saveEdit(sale.id)}
                        >
                          حفظ
                        </button>
                        <button
                          className="rounded-2xl border border-slate-700 px-3 py-1 text-sm text-slate-200"
                          onClick={cancelEdit}
                        >
                          إلغاء
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="rounded-2xl bg-slate-700 px-3 py-1 text-sm text-white hover:bg-slate-600"
                          onClick={() => startEdit(sale)}
                        >
                          تعديل
                        </button>
                        <button
                          className="rounded-2xl bg-red-600 px-3 py-1 text-sm font-semibold text-white hover:bg-red-500"
                          onClick={() => deleteSale(sale.id)}
                        >
                          حذف
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
