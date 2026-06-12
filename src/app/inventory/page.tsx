"use client";

import { useEffect, useState } from "react";
import { formatDateDMY, parseDateDMY } from "@/lib/date";

type InventoryItem = {
  id: string;
  quantity: number;
  branch?: { id: string; name: string };
  product?: { id: string; name: string; costPrice: number; sellingPrice: number | null };
};

type Branch = { id: string; name: string };
type Product = { id: string; name: string };
type Supplier = { id: string; name: string };

const getTodayDate = () => formatDateDMY(new Date());

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [form, setForm] = useState({ branchId: "", productId: "", quantity: 1, date: getTodayDate(), supplierId: "", supplierPrice: "" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editQuantity, setEditQuantity] = useState<number>(1);

  const loadData = async () => {
    const res = await fetch("/api/lookup");
    const data = await res.json();

    setItems(data.inventory);
    setBranches(data.branches);
    setProducts(data.products);
    try {
      const sres = await fetch("/api/suppliers");
      if (sres.ok) setSuppliers(await sres.json());
    } catch (e) {
      // ignore
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (e: any) => {
    const value = e.target.name === "quantity" ? Number(e.target.value) : e.target.value;
    setForm({ ...form, [e.target.name]: value });
  };

  const parseApiResponse = async (res: Response) => {
    const text = await res.text();
    if (!text) return null;

    try {
      return JSON.parse(text);
    } catch {
      return null;
    }
  };

  const addStock = async () => {
    if (!form.branchId || !form.productId) {
      return alert("اختر الفرع والمنتج أولاً");
    }

    if (!form.date) {
      return alert("اختر تاريخ الإضافة");
    }

    const parsedDate = parseDateDMY(form.date);
    if (!parsedDate) {
      return alert("اكتب التاريخ بصيغة dd/mm/yyyy صحيحة");
    }

    if (form.quantity <= 0) {
      return alert("عدد الامتار يجب أن تكون أكبر من صفر");
    }

    const res = await fetch("/api/inventory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, date: parsedDate }),
    });

    const data = await parseApiResponse(res);
    if (!res.ok) {
      return alert(data?.error || "فشل إضافة المخزون");
    }

    setForm({ branchId: "", productId: "", quantity: 1, date: getTodayDate(), supplierId: "", supplierPrice: "" });
    loadData();
  };

  const startEdit = (item: InventoryItem) => {
    setEditingId(item.id);
    setEditQuantity(item.quantity);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveInventory = async (id: string) => {
    if (editQuantity < 0) {
      return alert("عدد الامتار يجب أن تكون 0 أو أكثر");
    }

    const res = await fetch(`/api/inventory/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity: editQuantity }),
    });

    const data = await parseApiResponse(res);
    if (!res.ok) {
      return alert(data?.error || "فشل تحديث المخزون");
    }

    setEditingId(null);
    loadData();
  };

  const deleteItem = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا السجل من المخزون؟")) return;

    const res = await fetch(`/api/inventory/${id}`, { method: "DELETE" });
    const data = await parseApiResponse(res);
    if (!res.ok) {
      return alert(data?.error || "فشل حذف المخزون");
    }

    loadData();
  };

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
        <h1 className="text-3xl font-bold text-white">📉 إدارة المخزون</h1>
        <p className="mt-2 text-slate-400">أضف المنتجات إلى فرع وادِر المخزون قبل بيعها للعميل.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-lg">
          <h2 className="text-xl font-semibold text-white">إضافة مخزون فرعي</h2>
          <div className="mt-6 space-y-4">
            <select
              name="branchId"
              value={form.branchId}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-500"
            >
              <option value="">اختر الفرع</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>{branch.name}</option>
              ))}
            </select>

            <select
              name="productId"
              value={form.productId}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-500"
            >
              <option value="">اختر المنتج</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>{product.name}</option>
              ))}
            </select>

            <input
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-500"
              name="quantity"
              type="number"
              min={1}
              value={form.quantity}
              onChange={handleChange}
              placeholder="عدد الامتار المضافة"
            />

            <div>
              <input
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-500"
                name="date"
                type="text"
                value={form.date}
                onChange={handleChange}
                placeholder="dd/mm/yyyy"
              />
              <p className="mt-2 text-xs text-slate-400">التاريخ بصيغة dd/mm/yyyy</p>
            </div>

            <select
              name="supplierId"
              value={form.supplierId}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-500"
            >
              <option value="">اختيار المورد (اختياري)</option>
              {suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
              ))}
            </select>

            <input
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-500"
              name="supplierPrice"
              type="number"
              placeholder="سعر المورد (اختياري)"
              value={form.supplierPrice}
              onChange={handleChange}
            />

            <button
              className="w-full rounded-2xl bg-cyan-500 px-5 py-3 text-base font-semibold text-slate-950 transition hover:bg-cyan-400"
              onClick={addStock}
            >
              إضافة المخزون للفرع
            </button>
          </div>
        </section>

        <aside className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-lg">
          <h2 className="text-xl font-semibold text-white">لماذا هذا مهم</h2>
          <div className="mt-6 space-y-4 text-slate-400">
            <p>سجل المنتج في المخزون أولاً حتى يصبح متاحًا للبيع في الفرع.</p>
            <p>المخزون يتم إضافته إلى الفرع المحدد ويتم تحديث عدد الامتار تلقائياً.</p>
            <p>بعد ذلك استخدم صفحة البيع لتسجيل العميل والبيع النهائي.</p>
          </div>
        </aside>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-slate-900 shadow-lg">
        <table className="min-w-full border-separate border-spacing-0 text-slate-200">
          <thead className="bg-slate-950 text-left text-sm uppercase tracking-[0.2em] text-slate-400">
            <tr>
              <th className="px-6 py-4">الفرع</th>
              <th className="px-6 py-4">المنتج</th>
              <th className="px-6 py-4">عدد الامتار</th>
              <th className="px-6 py-4">سعر التكلفة</th>
              <th className="px-6 py-4">سعر البيع</th>
              <th className="px-6 py-4">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                  لا يوجد مخزون مسجل حتى الآن.
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="border-t border-slate-800">
                  <td className="px-6 py-4">{item.branch?.name ?? "غير معروف"}</td>
                  <td className="px-6 py-4">{item.product?.name ?? "غير معروف"}</td>
                  <td className="px-6 py-4">
                    {editingId === item.id ? (
                      <input
                        type="number"
                        min={0}
                        value={editQuantity}
                        onChange={(e) => setEditQuantity(Number(e.target.value))}
                        className="w-24 rounded-2xl border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none"
                      />
                    ) : (
                      item.quantity
                    )}
                  </td>
                  <td className="px-6 py-4">{item.product?.costPrice ?? "-"}</td>
                  <td className="px-6 py-4">{item.product?.sellingPrice ?? "-"}</td>
                  <td className="px-6 py-4 flex flex-wrap gap-2">
                    {editingId === item.id ? (
                      <>
                        <button
                          className="rounded-2xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950"
                          onClick={() => saveInventory(item.id)}
                        >
                          حفظ
                        </button>
                        <button
                          className="rounded-2xl border border-slate-700 px-4 py-2 text-sm text-slate-200"
                          onClick={cancelEdit}
                        >
                          إلغاء
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="rounded-2xl bg-slate-700 px-4 py-2 text-sm text-white hover:bg-slate-600"
                          onClick={() => startEdit(item)}
                        >
                          تعديل
                        </button>
                        <button
                          className="rounded-2xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500"
                          onClick={() => deleteItem(item.id)}
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
