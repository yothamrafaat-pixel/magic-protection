"use client";

import { useEffect, useState } from "react";

type Customer = {
  id: string;
  name: string;
  phone: string | null;
  carType: string | null;
  model: string | null;
  chassis: string | null;
};

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [form, setForm] = useState({ name: "", phone: "", carType: "", model: "", chassis: "" });
  const [editingCustomerId, setEditingCustomerId] = useState<string | null>(null);
  const [editCustomer, setEditCustomer] = useState({ name: "", phone: "", carType: "", model: "", chassis: "" });

  const loadCustomers = async () => {
    const res = await fetch("/api/customers");
    const data = await res.json();
    setCustomers(data);
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addCustomer = async () => {
    if (!form.name || !form.phone) return alert("اكتب اسم العميل ورقم الهاتف");

    const res = await fetch("/api/customers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (!res.ok) {
      return alert(data.error || "فشل إضافة العميل");
    }

    setForm({ name: "", phone: "", carType: "", model: "", chassis: "" });
    loadCustomers();
    alert("تمت إضافة العميل");
  };

  const startEdit = (customer: Customer) => {
    setEditingCustomerId(customer.id);
    setEditCustomer({
      name: customer.name,
      phone: customer.phone || "",
      carType: customer.carType || "",
      model: customer.model || "",
      chassis: customer.chassis || "",
    });
  };

  const cancelEdit = () => {
    setEditingCustomerId(null);
  };

  const saveCustomer = async (id: string) => {
    const res = await fetch(`/api/customers/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editCustomer),
    });

    const data = await res.json();
    if (!res.ok) {
      return alert(data.error || "فشل تحديث العميل");
    }

    setEditingCustomerId(null);
    loadCustomers();
  };

  const deleteCustomer = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا العميل؟")) return;

    const res = await fetch(`/api/customers/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) {
      return alert(data.error || "فشل حذف العميل");
    }

    loadCustomers();
  };

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
        <h1 className="text-3xl font-bold text-white">👤 إدارة العملاء</h1>
        <p className="mt-2 text-slate-400">سجل بيانات العملاء بسيطًا ووفر خدمة حماية مُحترفة لكل عميل.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-lg">
          <h2 className="text-xl font-semibold text-white">إضافة عميل جديد</h2>
          <div className="mt-6 grid gap-4">
            <input
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-500"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="الاسم"
            />
            <input
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-500"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="الهاتف"
            />
            <input
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-500"
              name="carType"
              value={form.carType}
              onChange={handleChange}
              placeholder="نوع السيارة"
            />
            <input
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-500"
              name="model"
              value={form.model}
              onChange={handleChange}
              placeholder="الموديل"
            />
            <input
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-500"
              name="chassis"
              value={form.chassis}
              onChange={handleChange}
              placeholder="رقم الشاسيه"
            />
            <button
              className="w-full rounded-2xl bg-cyan-500 px-5 py-3 text-base font-semibold text-slate-950 transition hover:bg-cyan-400"
              onClick={addCustomer}
            >
              إضافة عميل
            </button>
          </div>
        </section>

        <aside className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-lg">
          <h2 className="text-xl font-semibold text-white">قاعدة العملاء</h2>
          <div className="mt-6 space-y-4">
            {customers.length === 0 ? (
              <p className="text-slate-400">لم يتم تسجيل أي عملاء بعد.</p>
            ) : (
              customers.map((customer) => (
                <div key={customer.id} className="rounded-3xl border border-slate-800 bg-slate-950 p-4">
                  {editingCustomerId === customer.id ? (
                    <div className="space-y-4">
                      <input
                        className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-500"
                        value={editCustomer.name}
                        onChange={(e) => setEditCustomer({ ...editCustomer, name: e.target.value })}
                        placeholder="الاسم"
                      />
                      <input
                        className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-500"
                        value={editCustomer.phone}
                        onChange={(e) => setEditCustomer({ ...editCustomer, phone: e.target.value })}
                        placeholder="الهاتف"
                      />
                      <input
                        className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-500"
                        value={editCustomer.carType}
                        onChange={(e) => setEditCustomer({ ...editCustomer, carType: e.target.value })}
                        placeholder="نوع السيارة"
                      />
                      <input
                        className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-500"
                        value={editCustomer.model}
                        onChange={(e) => setEditCustomer({ ...editCustomer, model: e.target.value })}
                        placeholder="الموديل"
                      />
                      <input
                        className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-500"
                        value={editCustomer.chassis}
                        onChange={(e) => setEditCustomer({ ...editCustomer, chassis: e.target.value })}
                        placeholder="رقم الشاسيه"
                      />
                      <div className="flex gap-3">
                        <button
                          className="rounded-2xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950"
                          onClick={() => saveCustomer(customer.id)}
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
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <h3 className="font-semibold text-white">{customer.name}</h3>
                          <p className="text-slate-400">{customer.phone || "بدون هاتف"}</p>
                        </div>
                        <span className="rounded-full bg-cyan-500 px-3 py-1 text-sm font-semibold text-slate-950">عميل</span>
                      </div>
                      <p className="mt-3 text-sm text-slate-500">سيارة: {customer.carType || "غير محددة"} - {customer.model || "-"}</p>
                      <p className="text-sm text-slate-500">الشاسيه: {customer.chassis || "غير محدد"}</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <button
                          className="rounded-2xl bg-slate-700 px-4 py-2 text-sm text-white hover:bg-slate-600"
                          onClick={() => startEdit(customer)}
                        >
                          تعديل
                        </button>
                        <button
                          className="rounded-3xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500"
                          onClick={() => deleteCustomer(customer.id)}
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
