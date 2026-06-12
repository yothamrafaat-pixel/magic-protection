"use client";

import { useEffect, useState } from "react";

type Supplier = {
  id: string;
  name: string;
  contact?: string | null;
};

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [form, setForm] = useState({ name: "", contact: "" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editSupplier, setEditSupplier] = useState({ name: "", contact: "" });

  const load = async () => {
    const res = await fetch("/api/suppliers");
    const data = await res.json();
    setSuppliers(data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addSupplier = async () => {
    if (!form.name) return alert("اكتب اسم المورد");

    const res = await fetch("/api/suppliers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (!res.ok) {
      return alert(data.error || "فشل إضافة المورد");
    }

    setForm({ name: "", contact: "" });
    load();
  };

  const startEdit = (supplier: Supplier) => {
    setEditingId(supplier.id);
    setEditSupplier({
      name: supplier.name,
      contact: supplier.contact ?? "",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveSupplier = async (id: string) => {
    const res = await fetch(`/api/suppliers/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editSupplier),
    });

    const data = await res.json();
    if (!res.ok) {
      return alert(data.error || "فشل تحديث المورد");
    }

    setEditingId(null);
    load();
  };

  const deleteSupplier = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا المورد؟")) return;

    const res = await fetch(`/api/suppliers/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) {
      return alert(data.error || "فشل حذف المورد");
    }

    load();
  };

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
        <h1 className="text-3xl font-bold text-white">🏭 إدارة الموردين</h1>
        <p className="mt-2 text-slate-400">أضف وأدر بيانات الموردين والشركات الموردة للمنتجات.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-lg">
          <h2 className="text-xl font-semibold text-white">إضافة مورد جديد</h2>
          <div className="mt-6 space-y-4">
            <input
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-500"
              name="name"
              placeholder="اسم المورد"
              value={form.name}
              onChange={handleChange}
            />
            <input
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-500"
              name="contact"
              placeholder="الهاتف أو البريد الإلكتروني (اختياري)"
              value={form.contact}
              onChange={handleChange}
            />
            <button
              className="w-full rounded-2xl bg-cyan-500 px-5 py-3 text-base font-semibold text-slate-950 transition hover:bg-cyan-400"
              onClick={addSupplier}
            >
              إضافة المورد
            </button>
          </div>
        </section>

        <aside className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-lg">
          <h2 className="text-xl font-semibold text-white">الموردين الحاليين</h2>
          <div className="mt-6 space-y-4">
            {suppliers.length === 0 ? (
              <p className="text-slate-400">لم يتم إضافة أي موردين بعد.</p>
            ) : (
              suppliers.map((supplier) => (
                <div key={supplier.id} className="rounded-3xl border border-slate-800 bg-slate-950 p-4">
                  {editingId === supplier.id ? (
                    <div className="space-y-4">
                      <input
                        className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-500"
                        value={editSupplier.name}
                        onChange={(e) => setEditSupplier({ ...editSupplier, name: e.target.value })}
                        placeholder="اسم المورد"
                      />
                      <input
                        className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-500"
                        value={editSupplier.contact}
                        onChange={(e) => setEditSupplier({ ...editSupplier, contact: e.target.value })}
                        placeholder="الهاتف أو البريد الإلكتروني"
                      />
                      <div className="flex gap-3">
                        <button
                          className="rounded-2xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950"
                          onClick={() => saveSupplier(supplier.id)}
                        >
                          حفظ
                        </button>
                        <button
                          className="rounded-2xl border border-slate-700 px-4 py-2 text-sm text-slate-200"
                          onClick={cancelEdit}
                        >
                          إلغاء
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h3 className="font-semibold text-white">{supplier.name}</h3>
                      <p className="text-sm text-slate-400">{supplier.contact ?? "بدون بيانات اتصال"}</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <button
                          className="rounded-2xl bg-slate-700 px-4 py-2 text-sm text-white hover:bg-slate-600"
                          onClick={() => startEdit(supplier)}
                        >
                          تعديل
                        </button>
                        <button
                          className="rounded-2xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500"
                          onClick={() => deleteSupplier(supplier.id)}
                        >
                          حذف
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
