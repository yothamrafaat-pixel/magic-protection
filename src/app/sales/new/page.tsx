"use client";

import { useEffect, useState } from "react";

export default function NewSalePage() {
  const [branches, setBranches] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  const [form, setForm] = useState({
    branchId: "",
    productId: "",
    quantity: 1,
    salePrice: "",
    name: "",
    phone: "",
    carType: "",
    model: "",
    chassis: "",
  });

  useEffect(() => {
    fetch("/api/branches").then((r) => r.json()).then(setBranches);
    fetch("/api/products").then((r) => r.json()).then(setProducts);
  }, []);

  const handleChange = (e: any) => {
    if (e.target.name === "productId") {
      const nextProduct = products.find((p) => p.id === e.target.value);
      setForm({
        ...form,
        productId: e.target.value,
        salePrice: nextProduct?.sellingPrice ?? form.salePrice,
      });
      return;
    }

    const value = e.target.name === "quantity" || e.target.name === "salePrice"
      ? Number(e.target.value)
      : e.target.value;

    setForm({ ...form, [e.target.name]: value });
  };

  const saveSale = async () => {
    if (!form.branchId || !form.productId) {
      return alert("اختر الفرع والمنتج أولاً");
    }
    if (!form.salePrice) {
      return alert("اكتب سعر البيع لكل وحدة");
    }

    const product = products.find((p: any) => p.id === form.productId);
    const unitCost = product ? product.costPrice : 0;

    const res = await fetch("/api/sales", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        unitCost,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      return alert(data.error || "فشل حفظ البيع");
    }

    alert("تم حفظ البيع ✔");

    setForm({
      branchId: "",
      productId: "",
      quantity: 1,
      salePrice: "",
      name: "",
      phone: "",
      carType: "",
      model: "",
      chassis: "",
    });
  };

  const selectedProduct = products.find((p) => p.id === form.productId);
  const totalSale = Number(form.salePrice || 0);

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
        <h1 className="text-3xl font-bold text-white">💰 تسجيل بيع جديد</h1>
        <p className="mt-2 text-slate-400">سجل المبيعات لكل فرع مع بيانات العميل وسياسة الحماية.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-lg">
          <h2 className="text-xl font-semibold text-white">تفاصيل البيع</h2>
          <div className="mt-6 space-y-4">
            <select
              name="branchId"
              value={form.branchId}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-500"
            >
              <option value="">اختر الفرع</option>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>

            <select
              name="productId"
              value={form.productId}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-500"
            >
              <option value="">اختر المنتج</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>

            <div className="grid gap-4 sm:grid-cols-2">
              <input
                className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-500"
                name="quantity"
                type="number"
                value={form.quantity}
                onChange={handleChange}
                placeholder="الكمية"
                min={1}
              />
              <input
                className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-500"
                name="salePrice"
                type="number"
                value={form.salePrice}
                onChange={handleChange}
                placeholder="سعر البيع للوحدة"
              />
            </div>

            {selectedProduct && (
              <div className="rounded-3xl border border-slate-800 bg-slate-950 p-4 text-slate-200">
                <p>سعر التكلفة لكل وحدة: {selectedProduct.costPrice} EGP</p>
                <p>الربح يحسب على الوحدة فقط: سعر البيع - تكلفة الوحدة.</p>
                <p>سعر البيع الافتراضي: {selectedProduct.sellingPrice ?? "غير محدد"} EGP</p>
                <p className="mt-3 font-semibold text-white">الإجمالي = سعر الوحدة فقط = {totalSale.toFixed(2)} EGP</p>
              </div>
            )}

            <div className="rounded-3xl border border-slate-800 bg-slate-950 p-4 text-slate-200">
              <h3 className="font-semibold text-white">تفاصيل العميل</h3>
              <div className="grid gap-4 sm:grid-cols-2 mt-4">
                <input
                  className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-500"
                  name="name"
                  placeholder="اسم العميل"
                  value={form.name}
                  onChange={handleChange}
                />
                <input
                  className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-500"
                  name="phone"
                  placeholder="الهاتف"
                  value={form.phone}
                  onChange={handleChange}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-3 mt-4">
                <input
                  className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-500"
                  name="carType"
                  placeholder="نوع السيارة"
                  value={form.carType}
                  onChange={handleChange}
                />
                <input
                  className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-500"
                  name="model"
                  placeholder="الموديل"
                  value={form.model}
                  onChange={handleChange}
                />
                <input
                  className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-500"
                  name="chassis"
                  placeholder="رقم الشاسيه"
                  value={form.chassis}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button
              className="w-full rounded-2xl bg-cyan-500 px-5 py-3 text-base font-semibold text-slate-950 transition hover:bg-cyan-400"
              onClick={saveSale}
            >
              حفظ البيع
            </button>
          </div>
        </section>

        <aside className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-lg">
          <h2 className="text-xl font-semibold text-white">نظرة سريعة</h2>
          <div className="mt-6 space-y-4 text-slate-400">
            <p>اختر فرعًا ومنتجًا لتسجل البيع بشكل دقيق.</p>
            <p>سيتم حفظ بيانات العميل وربطه بالبيع للمراجعة لاحقًا.</p>
            <p>يمكنك العودة إلى لوحة التحكم لرؤية تقارير الأداء والمخزون.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
